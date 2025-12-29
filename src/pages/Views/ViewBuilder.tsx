import React, { useState, useEffect } from 'react'
import { Eye, Trash2, Database, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import "../../css/pages/Views/ViewBuilder.css"

const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL

const ViewBuilder = () => {
    const navigate = useNavigate()
    const [selectedFolder, setSelectedFolder] = useState('JobStatus Views')
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFolders()
    }, [])

    const fetchFolders = async () => {
        try {
            const schemaName = 'public' // TODO: Get from user context/Redux
            const response = await fetch(`${API_BASE_URL}/views/folders?schemaName=${schemaName}`)
            const data = await response.json()
            setFolders(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching folders:', error)
            setLoading(false)
        }
    }

    const selectedFolderData = folders.find(folder => folder.name === selectedFolder)

    const handleViewClick = (viewId) => {
        navigate(`/views/create-view/${viewId}`)
    }

    const handleCreateView = () => {
        navigate(`/views/create-view/new?folder=${selectedFolder}`)
    }

    const handleDeleteView = async (viewId, viewName, e) => {
        e.stopPropagation()
        if (window.confirm(`Are you sure you want to delete "${viewName}"? This will drop the PostgreSQL view.`)) {
            try {
                const schemaName = 'public' // TODO: Get from user context/Redux
                const response = await fetch(`${API_BASE_URL}/views/${viewId}?schemaName=${schemaName}`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    fetchFolders() // Refresh
                } else {
                    const data = await response.json()
                    alert('Failed to delete view: ' + (data.message || 'Unknown error'))
                }
            } catch (error) {
                console.error('Error deleting view:', error)
                alert('Failed to delete view. Please try again.')
            }
        }
    }

    if (loading) {
        return <div className="loading">Loading views...</div>
    }

    return (
        <div className='view-builder-container'>
            <div className="view-builder-header">
                <h1 className='view-builder-title'>View Builder</h1>
                <button className='new-view-btn' onClick={handleCreateView}>
                    +<br />
                    <span>New View</span>
                </button>
            </div>

            <div className="view-builder-content">
                {/* Left Panel - Folders */}
                <div className="folders-section">
                    <div className="section-title">
                        <h2>Folders</h2>
                    </div>

                    <div className="folders-list">
                        {folders.map(folder => (
                            <div
                                key={folder.id}
                                className={`folder-item ${selectedFolder === folder.name ? 'active' : ''}`}
                                onClick={() => setSelectedFolder(folder.name)}
                            >
                                <span className="folder-checkbox">☐</span>
                                <div className="folder-details">
                                    <span className="folder-name">{folder.name}</span>
                                    <span className="folder-count">{folder.views?.length || 0} views</span>
                                </div>
                                <span className="folder-arrow">›</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Views */}
                <div className="views-section">
                    <div className="section-title">
                        <h2>{selectedFolder}</h2>
                    </div>

                    <div className="views-list">
                        {selectedFolderData?.views && selectedFolderData.views.length > 0 ? (
                            selectedFolderData.views.map(view => (
                                <div key={view.id} className="view-item">
                                    <div className="view-main-content">
                                        <div className="view-header">
                                            <div className="view-title-section">
                                                <span className="view-name">{view.name}</span>
                                                <span className="sql-view-name">
                                                    <Database size={12} />
                                                    {view.sql_view_name}
                                                </span>
                                            </div>
                                        </div>

                                        {view.description && (
                                            <p className="view-description">{view.description}</p>
                                        )}

                                        <div className="view-meta">
                                            <span className="view-time">Modified {view.last_modified}</span>
                                            <span className="view-columns">
                                                {view.column_count} columns
                                            </span>
                                        </div>
                                    </div>

                                    <div className="view-actions">
                                        <button
                                            className="action-btn"
                                            onClick={() => handleViewClick(view.id)}
                                            title="Edit view"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="action-btn action-btn-danger"
                                            onClick={(e) => handleDeleteView(view.id, view.name, e)}
                                            title="Delete view"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-views">
                                <Database size={48} className="empty-icon" />
                                <p>No views in this folder</p>
                                <button className='new-view-btn-small' onClick={handleCreateView}>
                                    Create First View
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBuilder