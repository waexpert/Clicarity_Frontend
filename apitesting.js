import axios from "axios";

const cal = async (i) => {
  try {
    const result = await axios.get("https://click.wa.expert/api/getVendors");
    console.log("read",i);
  } catch (err) {
    console.error("Request failed:", err.message);
  }
};


const calUpdate = async (i) => {
  try {
    const result = await axios.get(`https://click.wa.expert/api/data/updateRecord?schemaName=wa_expert&tableName=tasks&recordId=0d70b71c-4c2a-4d2d-82b5-dac08a72ecde&columnName=notes&ownerId=73421c55-3152-455a-99e8-e09fbb00d9b8&value=updated Notes${i}`);
    console.log(result.data,i);
  } catch (err) {
    console.error("Request failed:", err.message);
  }
};

const addBirthDay = async (i) =>{

  try{
  const result = await axios.post("https://click.wa.expert/service/birthday/add",{
    "name": "Rajesh Kumar",
    "phone": "+919876543210",
    "birthday_date": "1990-05-27",
    "sender_name": "Priya Sharma",
    "sender_phone": "+919123456789",
    "special_day": "Birthday"
  });

     console.log(result.data,"birth",i);
}catch(err){
   console.error("Request failed:", err.message);
}
}

for (let i = 0; i < 3000; i++) {
  setTimeout(() => {
    // cal();
    // addBirthDay()
    calUpdate(i)
    console.log("done " + i);
  }, i * 9);
}

for (let i = 0; i < 3000; i++) {
  setTimeout(() => {
    // cal();
    addBirthDay(i)
    // calUpdate(i)
    console.log("done " + i);
  }, i * 9);
}


for (let i = 0; i < 3000; i++) {
  setTimeout(() => {
    cal(i);
    // addBirthDay(i)
    // calUpdate(i)
    console.log("done " + i);
  }, i * 9);
}