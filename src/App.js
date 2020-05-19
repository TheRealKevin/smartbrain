import React from 'react';
import Navigation from './Components/Navigation/Navigation';
import Clarifai from 'clarifai';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Register from './Components/Register/Register';
import Signin from './Components/Signin/Signin';
import Particles from 'react-particles-js';
import './App.css';




const particlesOptions = {
  particles: {
      number : {
        value : 390,
        density : {
          enable: true,
          value_area : 1500
        }
      },
    line_linked: {
       shadow: {
         enable: true,
         color: "#3CA9D1",
         blur: 5
       },
    }
  }
}

const initialState = {
  input : '',
      imageURL :'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user : {
        id: '',
        name: '',
        entries: 0,
        joined: ''
      }
}

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      input : '',
      imageURL :'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user : {
        id: '',
        name: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (userData) => {
      this.setState({user: {
        id: userData.id,
        name: userData.name,
        entries: userData.entries,
        joined: userData.joined
        }
      })
  }

 

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayBox = (boxDetails) => {
      console.log(boxDetails);
      this.setState({box: boxDetails});
    }

  onInputChange = (event) => {
    //console.log(event.target.value);
    this.setState({input: event.target.value});
  } 

  onButtonSubmit = () => {
      this.setState({imageURL: this.state.input});
      //console.log('Click');
      fetch('http://localhost:3000/imageurl',{
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
      })
      .then(response => response.json())
      .then(response => this.displayBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn:  true})
    }
    this.setState({route: route});
  }
//      --------> Didn't Understand why onClick has an
//      --------> Arrow Function inside it
  render(){
    const {isSignedIn ,box ,imageURL , route} = this.state;
    return(
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}
              />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home' ? 
            <div>
                <Rank />
                <Logo />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit = {this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageURL={imageURL}/>
              </div>
            : (
              this.state.route === 'signin' ? 
                <Signin onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
              )
        }
      </div>
    );
  }
}

export default App;
