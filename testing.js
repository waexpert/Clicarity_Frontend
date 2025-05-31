const message = [
    {
        "data_type": "uuid",
        "column_name": "id"
    },
    {
        "data_type": "character varying",
        "column_name": "first_name"
    },
    {
        "data_type": "character varying",
        "column_name": "last_name"
    },
    {
        "data_type": "character varying",
        "column_name": "email"
    },
    {
        "data_type": "text",
        "column_name": "password"
    },
    {
        "data_type": "character varying",
        "column_name": "phone_number"
    },
    {
        "data_type": "character varying",
        "column_name": "country"
    },
    {
        "data_type": "character",
        "column_name": "currency"
    },
    {
        "data_type": "boolean",
        "column_name": "is_verified"
    },
    {
        "data_type": "timestamp with time zone",
        "column_name": "created_at"
    },
    {
        "data_type": "timestamp with time zone",
        "column_name": "updated_at"
    },
    {
        "data_type": "boolean",
        "column_name": "mfa"
    },
    {
        "data_type": "text",
        "column_name": "mfa_secret"
    },
    {
        "data_type": "text",
        "column_name": "schema_name"
    },
    {
        "data_type": "text",
        "column_name": "role"
    },
    {
        "data_type": "text",
        "column_name": "owner_first_name"
    },
    {
        "data_type": "text",
        "column_name": "owner_id"
    },
    {
        "data_type": "ARRAY",
        "column_name": "products_activated"
    },
    {
        "data_type": "integer",
        "column_name": "api_calls"
    }
]

function capitalizeFirstLetter(str) {
    if (!str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const convert = (message) => {
    const converted = []
    message.forEach(element => {
        converted.push({
            name: element.column_name,
            // FIXED: Proper condition check using === or includes()
            type: capitalizeFirstLetter(
                (element.data_type === 'character varying' || element.data_type === 'text') 
                    ? 'text' 
                    : element.data_type
            )
        })
    });

    console.log(converted)
    return converted; // ADDED: Return the result
}

// FIXED: Pass the message parameter
convert(message);

// Alternative approach with better type mapping:
const convertWithMapping = (message) => {
    const typeMapping = {
        'character varying': 'text',
        'text': 'text',
        'character': 'text',
        'timestamp with time zone': 'timestamp',
        'ARRAY': 'array'
    };
    
    const converted = message.map(element => ({
        name: element.column_name,
        type: capitalizeFirstLetter(typeMapping[element.data_type] || element.data_type)
    }));

    console.log('Alternative approach:', converted);
    return converted;
}

convertWithMapping(message);