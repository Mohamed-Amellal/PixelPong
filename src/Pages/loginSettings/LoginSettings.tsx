// @ts-nocheck

import "./LoginSettings.scss"
import img3 from './assets/FarmerBoy.png';
import img2 from './assets/Detective.png';
import img1 from './assets/Glasses.png';
import img4 from './assets/Lady.png';
import img5 from './assets/old_man.png';
import img6 from './assets/Girl2.png';
import axios from "axios";
import {Toaster, toast } from 'react-hot-toast';


const retrieveCheckSendData = () => {
    const avatar        = document.querySelector('[name="avatarUpload"]').files[0];
    const nicknameInput = document.querySelector('[name="nickname"]').value;
    const usernameCheck = /^[A-Za-z0-9_]{5,15}$/;
    if (avatar && usernameCheck.test(nicknameInput))
    {
        const data = new FormData();
        data.append('file', avatar)
        toast.promise(
        axios.all([
            axios.post('http://localhost:3000/auth/signup-success', {username : nicknameInput}, { withCredentials: true }),
            axios.post('http://localhost:3000/auth/uploads', data, { withCredentials: true })
        ]).then(axios.spread((responseNickname, responseAvatar) => {            
            console.log(responseNickname , responseAvatar)            
        })).catch(() => {}),
        {
            loading: 'Loading...',
            success: 'Success',
            error: (err) => err.response.data.msg,
          },
        );
    }
    else
    {
        toast.error('Error')        
    }
}

const Avatars = () => {
    const handleClick = (idx : number) => {
        const avatars = [{img1}.img1,{img2}.img2,{img3}.img3,{img4}.img4,{img5}.img5,{img6}.img6];
        console.log("Avatar Seleted: " , avatars[idx])
    }

    return (
        <>  
        <div className="avatars">
            <img onClick={() => handleClick(0)} src={img1}/>
            <img onClick={() => handleClick(1)} src={img2} />
            <img onClick={() => handleClick(2)} src={img3} />
        </div>
        <div className="avatars">
            <img onClick={() => handleClick(3)} src={img4} />
            <img onClick={() => handleClick(4)} src={img5} />
            <img onClick={() => handleClick(5)} src={img6} />
        </div>
        </>
    );
};

const Toasts = () => {
    return (
        <Toaster
            reverseOrder={false}
            position='top-right'
            toastOptions={{
                style: {
                    borderRadius: '8px',
                    background: '#AC8FB4',
                    color: '#fff',
                },
            }}
        />
    );
}

export default function LoginSettings() {
        return (
        <div className="container">
            <div className="settingsBox">
                <div className="header">Settings</div>
                <div className="content">
                    <div>
                        <div className="nes-field">
                            <input type="text" name="nickname" className="nes-input" required placeholder='Choose Nickname'/>
                        </div>
                        <div className="choosingAvatarContainer">
                            <span className="is-primary">Choose Avatar</span>
                        </div>
                            <Avatars />
                        <div className="uploadContainer">
                            <label class="nes-btn">
                                <input formMethod="post" type="file" name="avatarUpload" accept=".png, .jpg, .jpeg" />
                                <span>Upload your avatar</span>
                            </label>
                        </div>
                        <div className="startContainer">
                            <Toasts/>
                            <a onClick={retrieveCheckSendData} className="nes-btn">Start</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
