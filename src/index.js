import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

/*
const APP_STARTUP_TIME = 'app_startup_time';

console.time(APP_STARTUP_TIME);

class App extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          alignItems: 'center',
          fontFamily: 'Roboto',
        }}
      >
        <img
          alt="Beaver"
          style={{
            height: '250px',
          }}
          src="https://pbs.twimg.com/profile_images/2779323089/f1d2488fedff90047a32244dbc624e59_400x400.jpeg"
        />
        <h2>Beaver</h2>
      </div>
    );
  }
}
*/

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId'); 
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);
  return  user;
};

class App extends Component {
  state = {
    userId: '',
    fullName: '',
    companyIds: [],
    allCompanies: [],
  };

  componentDidMount() {
    fetchUser()
    .then(data => {
      this.setState({
        userId: data.id,
        //userId: '1af52507-d023-453b-b3f8-8bab7d1d2363',
        fullName: data.fullName,
      });

      return axios.get(`${API}/users/${this.state.userId}/followingCompanies`);

    })
    .then(compData => {
      //console.log(compData.data);
      const followedCompIds = [];
      compData.data.forEach(comp => {
        //console.log(comp.id);
        followedCompIds.push(comp.companyId);
      });
      //console.log(followedCompIds)
      this.setState({
        companyIds: followedCompIds,
      })
      
      return axios.get(`${API}/companies`);

    })
    .then(allCompData => {
      console.log(allCompData);
      this.setState({
        allCompanies: allCompData.data,
      });
    });
  }

  render() {
    console.log(this.state);
    const { userId, fullName, companyIds, allCompanies } = this.state;

    const listMaker = () => {
      const filteredComps = allCompanies.filter((comp) => {
        console.log('entered? ', comp.id)
        if (companyIds.includes(comp.id)) {
          console.log('id', comp.id)
          return comp;
        }
      });
      return filteredComps;
    };

    const test = listMaker();
    console.log(test);

    console.log('Name :', fullName, " userId: ", userId);
    return (
      <div>
        <h1>
          Acme Company Follower
        </h1>
        <div>
          You ({fullName}) are following {companyIds.length} Companies
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'), () => {
  //console.timeEnd(APP_STARTUP_TIME);
});
