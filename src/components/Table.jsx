import React, { useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'

const Table = () => {

    const rows = [
        {
          "photoURL": "https://dummyimage.com/778x789",
          "name": "Tiffany Williams",
          "email": "ingramronald@matthews.biz",
          "phone": "206-264-3190",
          "active": true,
          "role": "Admin"
        },
        {
          "photoURL": "https://dummyimage.com/766x670",
          "name": "Katrina Ortiz",
          "email": "thomas72@gmail.com",
          "phone": "874.721.7485",
          "active": true,
          "role": "Manager"
        },
        {
          "photoURL": "https://dummyimage.com/365x454",
          "name": "Raymond Wolf",
          "email": "ggutierrez@glover-hess.biz",
          "phone": "361-315-2014x72355",
          "active": true,
          "role": "Editor"
        },
        {
          "photoURL": "https://www.lorempixel.com/496/1017",
          "name": "Kathleen Delgado",
          "email": "william00@anderson.com",
          "phone": "(650)898-2082",
          "active": true,
          "role": "Editor"
        },
        {
          "photoURL": "https://www.lorempixel.com/294/879",
          "name": "Rebecca Carpenter",
          "email": "xlara@gmail.com",
          "phone": "+1-837-093-8853",
          "active": false,
          "role": "Admin"
        },
        {
          "photoURL": "https://placeimg.com/530/494/any",
          "name": "Sara Johnson",
          "email": "gmccormick@yahoo.com",
          "phone": "(722)052-0685x74085",
          "active": false,
          "role": "User"
        },
        {
          "photoURL": "https://dummyimage.com/525x37",
          "name": "Joseph Beltran",
          "email": "meganmartin@yahoo.com",
          "phone": "160.259.4577x8785",
          "active": false,
          "role": "Admin"
        },
        {
          "photoURL": "https://dummyimage.com/756x75",
          "name": "Jessica Scott",
          "email": "bairdheather@ellis-wise.com",
          "phone": "815-424-0902",
          "active": true,
          "role": "Editor"
        },
        {
          "photoURL": "https://placekitten.com/158/13",
          "name": "Michaela Barker",
          "email": "timothymoon@gmail.com",
          "phone": "048.559.9391x2479",
          "active": true,
          "role": "Editor"
        },
        {
          "photoURL": "https://placeimg.com/791/410/any",
          "name": "Phillip Mcknight",
          "email": "paulreynolds@gmail.com",
          "phone": "815.047.4342",
          "active": false,
          "role": "User"
        }
      ];
      

    const columns = useMemo(()=>[
        {field:'photoURL',headerName:'Avatar',width:200},
        {field:'name',headerName:'Name',width:200},
        {field:'email',headerName:'Email',width:200},
        {field:'phone',headerName:'Phone',width:200},
        {field:'active',headerName:'Active',width:200},
        {field:'role',headerName:'Role',width:200},
    ])
  return (
    <div>

<DataGrid
columns={columns}
rows={rows}
getRowId={(row) => row.email}
    />

    </div>

  )
}

export default Table