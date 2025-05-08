import React from 'react'

const teamCard = () => {
  return (
    <div>
        <h2>Add Team Member</h2>
        <div className="">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="" />
        </div>
        <div className="">
            <label htmlFor="email">Name</label>
            <input type="email" name="email" id="" />
        </div>
        <div className="">
            <label htmlFor="password">Name</label>
            <input type="password" name="password" id="" />
        </div>
        <div className="">
            <select name="" id="">
            <option value=""></option>

            </select>
        </div>
    </div>
  )
}

export default teamCard