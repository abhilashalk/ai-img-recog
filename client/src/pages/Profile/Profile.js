import React, { Component } from "react";
import { Redirect } from "react-router";
import { getFromStorage } from '../../utils/storage';
import Container from "../../components/Container";
import Header from "../../components/Header";
import Cropper from 'react-cropper'
import TestImageUpload from  "../../components/TestImageUpload";
import ProfilePhotos from "../../components/ProfilePhotos";
import Footer from "../../components/Footer";
import API from "../../utils/API";
import "./Profile.css";
import 'cropperjs/dist/cropper.css';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      user_id: '',
      selectedFile: null,
      croppedFile: null,
      src: null,
      cropResult: null,
      displayImageCropper: "none",
      displayCropButton: "none",
      displayCroppedImage: "none",
      displaySubmit: "none"
    };
    this.logout = this.logout.bind(this);
  }

  //Marcus 
    componentDidMount() {
      const obj = getFromStorage('the_main-app');
      console.log(obj)
      if (obj && obj.token) {
        const { token } = obj;
        const { user_id } = obj;

        API.verify(token);
        this.loadTrees(user_id);
        this.setState ({
          token,
          user_id,
          isLoading: false,
          fireRedirect: false
        });
      }
    }

    loadTrees = (id) => {
      API.getTrees(id)
        // .then(res =>
        //   this.setState({ books: res.data, title: "", author: "", synopsis: "" })
        // )
        // .catch(err => console.log(err));
    }

    logout(e) {
      e.preventDefault()
      this.setState({
        isLoading: true,
      });

      console.log("button clicked");
      const obj = getFromStorage('the_main-app');

      if (obj && obj.token) {
        const { token } = obj;

        API.logOut(token)
        .then(json => {
          if (json.statusText==="OK") {
            this.setState({
              token: '',
              user_id: '',
              isLoading: false
            })
          } else {
            this.setState({
              isLoading: false
            })
          }
        })
      } else {
        this.setState({
          isLoading: false
        })
      }
      this.setState({fireRedirect: true});
    }
  //---*
  
  //Darwin 
    // Function to get file type from base64 string
    imageFileExtensionFromBase64 = base64Data => {
      return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));
    }

    // Function to convert base64 string and file name into file
    base64StringtoFile = (base64String, fileName) => {
      var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], fileName, {type: mime});
    }

    // Update state to catch file provided from client
    fileChangedHandler = event => { 
      this.setState({selectedFile: event.target.files[0]});
    }

    // Function to reset image submission form
    resetForm = () => { 
      document.getElementById("leaf-submit").reset();  
      this.setState({ selectedFile: null,
          croppedFile: null,
          src: null,
          cropResult: null,
          displayImageCropper: "none",
          displayCropButton: "none",
          displayCroppedImage: "none",
          displaySubmit: "none"});
    }
    
    // Function to handle image upload to server 
    uploadHandler = () => { 
      const obj = getFromStorage('the_main-app');
      // If there's no cropped file, throw error
      if (!this.state.croppedFile) { 
        alert("Please provide a photo")
      } else { // Otherwise submit cropped file to server
        const { user_id } = obj;
        const formData = new FormData()
        formData.append('photo', this.state.croppedFile, this.state.croppedFile.fileName);
        formData.append('user_id', user_id);
        API.postImage(formData) 
          .then(function(res) {
            console.log(res.data);
        });
        this.resetForm();
      }
    }

    // Function to display file provided by user in image cropper
    onSelectFile = event => {
      event.preventDefault();
      let files;
      if (event.dataTransfer) {
        files = event.dataTransfer.files;
      } else if (event.target) {
        files = event.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({ src: reader.result, displayImageCropper: "block", displayCropButton: "block", displayCroppedImage: "none", displaySubmit: "none" });
      };
      reader.readAsDataURL(files[0]);
    }

    // Function to crop image
    cropImage = event => {
      event.preventDefault();
      if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
        return;
      }
      this.setState({
        cropResult: this.cropper.getCroppedCanvas({height: 666}).toDataURL('image/jpeg'),
        displayImageCropper: "none",
        displayCropButton: "none",
        displayCroppedImage: "block",
        displaySubmit: "block"
      });
    }

    // Function to create file from cropped image and upload
    handleImageUpload = event => {
      event.preventDefault();
      const cropBase64 = this.state.cropResult;
      const fileExt = this.imageFileExtensionFromBase64(cropBase64);
      const fileName = `photo.${fileExt}`;
      this.setState({ croppedFile: this.base64StringtoFile(cropBase64, fileName) }, 
        this.uploadHandler
      );
    }
  //---*

  render() {
    const {
      fireRedirect
    } = this.state;

    return (
      <Container fluid>
        <Header />
        <div>
          <TestImageUpload 
            fileChangedHandler={this.fileChangedHandler}
            handleImageUpload={this.handleImageUpload}
            onSelectFile={this.onSelectFile}
            cropImage={this.cropImage}
            displayCropButton={this.state.displayCropButton}
            displaySubmit={this.state.displaySubmit}
          />
          <div style={{display: this.state.displayImageCropper}}>
            <Cropper
              style={{ height: 300, width: '50%' }}
              aspectRatio={1 / 1}
              guides={false}
              src={this.state.src}
              ref={cropper => { this.cropper = cropper; }}
              background={false}
              viewMode={2}
              zoomable={false}
            />
          </div>
          <img style={{ height: 333, display: this.state.displayCroppedImage }} src={this.state.cropResult} alt="cropped" />
        </div>
        <ProfilePhotos />
        <button id="logout" type="button" className="btn btn-success"
        onClick={this.logout}>
            Log Out
        </button>
        <Footer />
        {fireRedirect && (
          <Redirect to={'/signin'}/>
          )}
      </Container>
    );
  }
}

export default Profile;
