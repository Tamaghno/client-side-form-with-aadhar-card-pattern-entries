import React from 'react';
import {validateEmail,validateMobile} from "./validate";
import {Table} from "./Table";

import * as firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyBjVvvb6cLTkGj94KlVMH8ADoY52jtD6vU",
    authDomain: "aadharcard-7949d.firebaseapp.com",
    databaseURL: "https://aadharcard-7949d.firebaseio.com",
    projectId: "aadharcard-7949d",
    storageBucket: "aadharcard-7949d.appspot.com",
    messagingSenderId: "160303886849",
    appId: "1:160303886849:web:a6a872aa0ab4741d3c4600"
  };
firebase.initializeApp(firebaseConfig);

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={user:[],userfield:{name:"",address:"",fname:"",phno:"",dob:"",adno:"",email:"",avatar: null}}
  }
  onchange=(e)=>
  {
    //debugger;
    const { userfield } = this.state;
    userfield[e.target.name] = e.target.value;
    this.setState({
      userfield
    });
  }
  componentDidMount()
  {
    const { userfield } = this.state;
   
    this.setState({
      userfield,
    });
    const db=firebase.firestore();
    //db.collection("User").get();
   /* console.log(db.collection("User").onSnapshot(function(collection) {
      console.log("Current data: ", collection.data());
  }));*/
   // db.collection("User").onSnapshot((collection)=>{this.setState({docid:collection.docs},()=>console.log(this.state.docid))});
   // db.collection("User").doc("7DDiTYAbP855F36SAcTn").onSnapshot((doc)=>{console.log(doc.data())})
   db.collection("student").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        this.setState({user:this.state.user.concat(doc.data())});
    });
    console.log(this.state.user);
});
  }
  addUser=()=>
  {
    const db = firebase.firestore();
    var storage=firebase.storage();
    console.log('db', db);
     !validateEmail(this.state.userfield.email) && alert("Invalid email ID");
     !validateMobile(this.state.userfield.phno) && alert("Invalid phone number");
      db.collection("student").add({
      address: this.state.userfield.address,
      AdharNo: Math.floor(100000000000 + Math.random() * 900000000000),
      DOB:this.state.userfield.dob,
      Name:this.state.userfield.name,
      fname:this.state.userfield.fname,
      number:this.state.userfield.phno,
      emailID:this.state.userfield.email

    }).then(docref => {
    storage.ref().child('images').put(this.state.userfield.avatar).then((snapshot)=>{snapshot.ref.getDownloadURL().then(url=>db.collection("student").doc(docref.id).set({url:url},{merge:true}));});
    });
    

    const { userfield } = this.state;
    userfield.adno ="";
    userfield.name="";
    userfield.phno="";
    userfield.fname="";
    userfield.address="";
    userfield.dob="";
    userfield.email="";
    this.setState({
      userfield,
    });
  }

handleAvatar=(e)=>{
  this.setState({
    userfield: {...this.state.userfield, avatar: e.target.files[0]}
  });
}

  render()
  {
    return(
      <div>
      <div className='haha'>
      <label>Welcome to AADHAR portal</label><br/><br/>
          <label>
            Name   :
            <input type="text" value={this.state.userfield.name} name="name" onChange={this.onchange}/>
          </label><br/><br/>
          <label>
            Address   :
            <input type="text" value={this.state.userfield.address} name="address" onChange={this.onchange}/>
          </label><br/><br/>
          <label>
            Father's Name   :      
            <input type="text" value={this.state.userfield.fname} name="fname" onChange={this.onchange}/>
          </label><br/><br/>
          <label>
            Phone Number   :
            <input type="text" value={this.state.userfield.phno} name="phno" onChange={this.onchange}/>
          </label><br/><br/>
          <label>
            Date Of Birth   :
            <input type="text" value={this.state.userfield.dob} name="dob" onChange={this.onchange} />
          </label><br/><br/>
          <label>
            Email ID   :
            <input type="text" value={this.state.userfield.email} name="email" onChange={this.onchange} />
          </label><br/><br/>
          <label>
            Enter image   :
            <input type="file" onChange={this.handleAvatar} />
          </label><br/><br/>

          <label>
            Addhar Number   : (to be displayed on submission) {this.state.userfield.adno}
           
          </label><br/><br/>
          <div type="button" onClick={this.addUser}><img src={`https://t3.ftcdn.net/jpg/00/26/06/02/240_F_26060298_S8Mxr8UxWy7pBzOt4STyeXfmSBqjc7gv.jpg`} height='50px' width='200px'/></div>
        </div>
        <br/>
        <br/>
        <br/>
          <div className='haha2'>
        <Table user={this.state.user}/>
        </div>
        </div>
      
    );
  }
}

export default App;