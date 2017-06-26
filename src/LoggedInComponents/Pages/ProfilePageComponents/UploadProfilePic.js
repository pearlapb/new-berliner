import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';

class UploadProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleImageSubmition(e) {
        var formData = new FormData();
        var file = $('input[type="file"]').get(0).files[0];
        formData.append('file', file)
        axios.post('/uploadProfilePicture', formData).then((res) => {
            let newProfilePic = res.data.file.rows[0].profile_pic_url;
            this.props.setNewImage(newProfilePic);
        })
    }

    render() {
        return (
            <form id="upload-profile-pic">
                <label id="choose-file-label" htmlFor="choose-file">Change?</label>
                <input type="file" id="choose-file" className="hidden" onChange={() => this.handleImageSubmition()}/>
            </form>
        )
    }
}

export default UploadProfilePic;
