const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

// Server configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'task_management'
};

// Create reports directory if it doesn't exist
const REPORTS_DIR = path.join(__dirname, 'reports');
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

class TaskPDFGenerator {
    constructor() {
        this.doc = null;
        this.currentY = 0;
        this.pageMargin = 50;
        this.pageWidth = 612 - (2 * this.pageMargin);
        
        // Priority colors
        this.priorityColors = {
            'High': '#FFE4E1',
            'Medium': '#E6F3FF',
            'Low': '#F0FFF0'
        };
        
        // Table configuration
        this.tableConfig = {
            columns: [
                { name: 'Task Name', width: 100, field: 'Task Name' },
                { name: 'Description', width: 120, field: 'Description' },
                { name: 'Remarks', width: 100, field: 'Pending Comments' },
                { name: 'Attachments', width: 80, field: 'Task Image URL' },
                { name: 'Due Date', width: 70, field: 'Due Date' },
                { name: 'Mark Done', width: 70, field: 'action' }
            ],
            rowHeight: 35,
            headerHeight: 25,
            fontSize: 9,
            headerFontSize: 10
        };
    }

    generatePDF(tasks, assignedTo) {
        return new Promise((resolve, reject) => {
            const filename = `${assignedTo.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
            const filepath = path.join(REPORTS_DIR, filename);
            
            this.doc = new PDFDocument({ 
                margin: this.pageMargin,
                size: 'letter'
            });
            
            const stream = fs.createWriteStream(filepath);
            this.doc.pipe(stream);
            
            // Add content
            this.addHeader();
            this.addGreeting(assignedTo);
            
            // Categorize tasks
            const categorized = this.categorizeTasks(tasks);
            
            // Add sections
            if (categorized.overdue.length > 0) {
                this.addSection('OVERDUE', categorized.overdue, assignedTo);
            }
            
            if (categorized.dueToday.length > 0) {
                this.addSection('DUE TODAY', categorized.dueToday, assignedTo);
            }
            
            if (categorized.dueLater.length > 0) {
                this.addSection('DUE LATER', categorized.dueLater, assignedTo);
            }
            
            // Finalize
            this.doc.end();
            
            stream.on('finish', () => resolve({ filepath, filename }));
            stream.on('error', reject);
        });
    }

    addHeader() {
        this.doc
            .fontSize(16)
            .font('Helvetica-Bold')
            .text('Company Name', { align: 'center' });
        
        this.doc.moveDown(1);
        this.currentY = this.doc.y;
    }

    addGreeting(assignedTo) {
        const today = new Date().toLocaleDateString('en-US');
        
        this.doc
            .fontSize(11)
            .font('Helvetica')
            .text(`Dear ${assignedTo},`);
        
        this.doc.moveDown(0.5);
        
        this.doc
            .fontSize(10)
            .text(`This document provides a summary of your tasks as of ${today}, organized by due date and priority. Please review your tasks and their status to manage your workload effectively. You can click on "Click Here" to mark tasks as complete.`, {
                width: this.pageWidth
            });
        
        this.doc.moveDown(1.5);
        this.currentY = this.doc.y;
    }

    categorizeTasks(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const categorized = {
            overdue: [],
            dueToday: [],
            dueLater: []
        };
        
        tasks.forEach(task => {
            // Skip completed tasks
            if (task['Status'] && task['Status'].toLowerCase() === 'completed') {
                return;
            }
            
            const dueDate = this.parseDate(task['Due Date']);
            if (!dueDate) return;
            
            dueDate.setHours(0, 0, 0, 0);
            
            if (dueDate < today) {
                categorized.overdue.push(task);
            } else if (dueDate.getTime() === today.getTime()) {
                categorized.dueToday.push(task);
            } else {
                categorized.dueLater.push(task);
            }
        });
        
        // Sort by priority
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        
        Object.keys(categorized).forEach(key => {
            categorized[key].sort((a, b) => {
                const priorityA = priorityOrder[a['Priority']] || 4;
                const priorityB = priorityOrder[b['Priority']] || 4;
                return priorityA - priorityB;
            });
        });
        
        return categorized;
    }

    parseDate(dateValue) {
        if (!dateValue) return null;
        
        if (dateValue instanceof Date) {
            return dateValue;
        }
        
        const parsed = new Date(dateValue);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
        
        return null;
    }

    addSection(sectionTitle, tasks, assignedTo) {
        if (tasks.length === 0) return;
        
        // Section header
        this.doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .fillColor('#000080')
            .text(sectionTitle, this.pageMargin, this.currentY);
        
        this.doc.moveDown(0.5);
        this.currentY = this.doc.y;
        
        // Tasks for:
        this.doc
            .fontSize(11)
            .font('Helvetica')
            .fillColor('black')
            .text(`Tasks for: ${assignedTo}`, this.pageMargin, this.currentY);
        
        this.doc.moveDown(1);
        this.currentY = this.doc.y;
        
        // Group by priority
        const tasksByPriority = this.groupByPriority(tasks);
        
        ['High', 'Medium', 'Low'].forEach(priority => {
            if (tasksByPriority[priority] && tasksByPriority[priority].length > 0) {
                this.addPriorityTable(priority, tasksByPriority[priority]);
            }
        });
    }

    groupByPriority(tasks) {
        const grouped = {};
        
        tasks.forEach(task => {
            const priority = task['Priority'] || 'Low';
            if (!grouped[priority]) {
                grouped[priority] = [];
            }
            grouped[priority].push(task);
        });
        
        return grouped;
    }

    addPriorityTable(priority, tasks) {
        // Check page space
        const estimatedHeight = 30 + (tasks.length * this.tableConfig.rowHeight);
        if (this.currentY + estimatedHeight > 700) {
            this.doc.addPage();
            this.currentY = this.pageMargin;
        }
        
        // Priority heading
        this.doc
            .fontSize(12)
            .font('Helvetica-Bold')
            .fillColor('#333333')
            .text(`${priority} Priority`, this.pageMargin, this.currentY);
        
        this.currentY += 20;
        
        // Draw table
        this.drawTable(priority, tasks);
        this.currentY += 20;
    }

    drawTable(priority, tasks) {
        const headerColor = this.priorityColors[priority];
        const startX = this.pageMargin;
        
        // Draw header
        let currentX = startX;
        
        // Header background
        this.doc
            .rect(startX, this.currentY, this.pageWidth, this.tableConfig.headerHeight)
            .fill(headerColor)
            .stroke('#CCCCCC');
        
        // Header text
        this.doc
            .fillColor('black')
            .fontSize(this.tableConfig.headerFontSize)
            .font('Helvetica-Bold');
        
        this.tableConfig.columns.forEach(column => {
            this.doc.text(
                column.name,
                currentX + 3,
                this.currentY + 5,
                {
                    width: column.width - 6,
                    align: 'left'
                }
            );
            currentX += column.width;
        });
        
        this.currentY += this.tableConfig.headerHeight;
        
        // Draw rows
        tasks.forEach((task, index) => {
            this.drawTableRow(task, index, startX);
        });
    }

    drawTableRow(task, index, startX) {
        let currentX = startX;
        
        // Check page space
        if (this.currentY + this.tableConfig.rowHeight > 700) {
            this.doc.addPage();
            this.currentY = this.pageMargin;
        }
        
        // Row border
        this.doc
            .rect(startX, this.currentY, this.pageWidth, this.tableConfig.rowHeight)
            .stroke('#CCCCCC');
        
        // Reset text
        this.doc
            .fillColor('black')
            .fontSize(this.tableConfig.fontSize)
            .font('Helvetica');
        
        // Draw cells
        this.tableConfig.columns.forEach(column => {
            if (column.field === 'action') {
                // Mark Done link
                const webhookUrl = `${process.env.WEBHOOK_URL || 'https://example.com/webhook'}?uid=${task['UID']}&action=complete`;
                this.doc
                    .fillColor('#0066CC')
                    .text('Click Here', currentX + 3, this.currentY + 10, {
                        width: column.width - 6,
                        align: 'center',
                        link: webhookUrl,
                        underline: true
                    });
            } else if (column.field === 'Task Image URL' && task[column.field]) {
                // Attachment link
                this.doc
                    .fillColor('#0066CC')
                    .text('View File', currentX + 3, this.currentY + 10, {
                        width: column.width - 6,
                        align: 'center',
                        link: task[column.field]
                    });
            } else if (column.field === 'Due Date') {
                // Format date
                const formattedDate = this.formatShortDate(task[column.field]);
                this.drawCellText(formattedDate, currentX, this.currentY, column.width);
            } else if (column.field === 'Description') {
                // Default text if empty
                const text = task[column.field] || 'Please prioritize this task.';
                this.drawCellText(text, currentX, this.currentY, column.width);
            } else if (column.field === 'Pending Comments') {
                // Default text if empty
                const text = task[column.field] || 'Waiting for approval';
                this.drawCellText(text, currentX, this.currentY, column.width);
            } else {
                // Regular text
                this.drawCellText(task[column.field] || '', currentX, this.currentY, column.width);
            }
            
            currentX += column.width;
        });
        
        this.currentY += this.tableConfig.rowHeight;
    }

    drawCellText(text, x, y, width) {
        this.doc
            .fillColor('black')
            .font('Helvetica')
            .text(text, x + 3, y + 10, {
                width: width - 6,
                align: 'left',
                ellipsis: true,
                lineBreak: false
            });
    }

    formatShortDate(date) {
        if (!date) return '';
        
        const d = this.parseDate(date);
        if (!d) return date.toString();
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return `${days[d.getDay()]} ${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
    }
}

// Database connection helper
async function getDbConnection() {
    return await mysql.createConnection(dbConfig);
}

// API endpoint to generate PDF report
app.get('/generate-report', async (req, res) => {
    let connection;
    
    try {
        const { schemaName, tableName, assigned_to } = req.query;
        
        // Validate parameters
        if (!schemaName || !tableName || !assigned_to) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: schemaName, tableName, assigned_to'
            });
        }
        
        // Connect to database
        connection = await getDbConnection();
        
        // Switch to the specified schema
        await connection.query(`USE ??`, [schemaName]);
        
        // Query for tasks assigned to the specified person
        const query = `
            SELECT * FROM ?? 
            WHERE \`Assigned to\` = ? 
            AND (Status IS NULL OR Status != 'Completed')
            ORDER BY \`Due Date\` ASC, Priority ASC
        `;
        
        const [tasks] = await connection.query(query, [tableName, assigned_to]);
        
        console.log(`Found ${tasks.length} tasks for ${assigned_to}`);
        
        if (tasks.length === 0) {
            return res.json({
                success: false,
                message: `No pending tasks found for ${assigned_to}`
            });
        }
        
        // Generate PDF
        const generator = new TaskPDFGenerator();
        const { filepath, filename } = await generator.generatePDF(tasks, assigned_to);
        
        // Send the PDF file
        res.download(filepath, filename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error sending PDF file'
                });
            }
            
            // Optionally delete the file after sending
            // fs.unlinkSync(filepath);
        });
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating report: ' + error.message
        });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'PDF Report Server is running!',
        endpoints: {
            generateReport: '/generate-report?schemaName=YOUR_SCHEMA&tableName=YOUR_TABLE&assigned_to=EMPLOYEE_NAME'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 PDF Report Server running on port ${PORT}`);
    console.log(`📄 Reports will be saved to: ${REPORTS_DIR}`);
    console.log(`\nExample usage:`);
    console.log(`http://localhost:${PORT}/generate-report?schemaName=task_db&tableName=Sheet1&assigned_to=John%20Doe`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { TaskPDFGenerator };