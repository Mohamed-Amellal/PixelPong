import './chatPage.css'
import Send from './assets/images/send.svg'
import star from './assets/images/star.svg';
import diamond from './assets/diamond.svg';
import mamella from './assets/images/mamellal.jpg'

import sparkles from './assets/images/sparkles.gif';
import './Stars.css';



function Stars() {
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 120; i++)
        {
            const x = Math.random() * window.innerHeight;
            const y = Math.random() * window.innerWidth;
            const style = { 
                top: x,
                left: y,
                opacity: Math.random() * 10,
            };
            stars.push(
                <div className="stars {index}" style={style} key={i}>
                    <img src={star} alt="Star" />
                </div>
            );
        }
        return stars;
    };
    return (
        <div className="container">
            {renderStars()}
        </div>
    );
}

function Chat () {
    return (
        <>
        {/* <Stars/> */}
        <div className="pageContainer">
            <div className='NavBar'></div>

            <div className='chatNavBar'>
                <div className="searchBar">
                    <div className="serachBarTxt">
                        <h1>CHAT</h1>
                    </div>
                    <div className="searchBarBox">
                        <input type="text" id="inline_field" className="chatSearchBox" placeholder="Search"></input>
                    </div>
                </div>
                <div className="onlineMemebersBar">
                    <div className='chatSection'>
                        <h2 id='chatText'>CHAT</h2>
                        <div className='dms'>
                            <div className="vertical-menu">
                                <a href="#">Mohamed Amellal</a>
                                <a href="#">Declane Rice</a>
                                <a href="#">Santi Cazorla</a>
                                <a href="#">William Saliba</a>
                                <a href="#">Gabriel</a>
                                <a href="https://www.espn.com/soccer/player/_/id/238004/takehiro-tomiyasu">Takehiro Tomiyasu</a>
                                <a href="#">Martin Ødegaard</a>
                                <a href="#">Mohamed Elneny</a>
                                <a href="#">Leandro Trossard</a>
                                <a href="#">ras denjala</a>
                            </div>
                    </div>
                    </div>
                    <div className='groupeSection'>
                        <h2 id='groupesText'>GROUPES</h2>
                        <div className="groupChat">
                        <div className="vertical-menu">
                                <a href="#">Arsenal Group</a>
                                <a href="#">Pl Group</a>
                                <a href="#">Moroccan Supporters</a>
                                <a href="#">PL Group</a>
                                <a href="#">LOL Team</a>
                                <a href="#">PingPongers</a>
                                <a href="#">uk team</a>
                                <a href="#">Lets's play</a>
                                <a href="#">Chuppa kabra</a>
                                <a href="#">ras lefta</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lowerBar"></div>
            </div>

            <div className='chatBody'>
                <div className="playerProfileSec">
                    <div className="playerProfilesRec">
                        <div className="playerProfileRecDiv">
                            Player Profile
                        </div>
                    </div>
                    <div className="playerProfile">
                        <div className="playerNamePic">
                            <div className="playerPic"></div>
                            <div className="playerNamediv">
                                <div className="playerName">MOHAMED AMELLAL</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="playerProfileBar">
                    <div className='conversationBody'>
                        <section className="message-list">
                            <section className="message-left">
                                <div className="left-interlocutor-pic-div"></div>
                                <div className="nes-balloon from-left">
                                    <p>Salam khouya bikhir ?</p>
                                </div>
                            </section>

                            <section className="message-right">
                                <div className="nes-balloon from-right">
                                    <p>Good morning. Thou hast had a good night's sleep, I hope.</p>
                                </div>
                                <img className="right-interlocutor-pic" alt='right-interlocutor' src={diamond}></img>
                            </section>

                        </section>
                    </div>
                    <div className='sendMessage'>
                        <input className='messageInputBox' placeholder='Type your message here ...'></input>
                        <button className='sendButton'><img src={Send}></img></button>
                    </div>

                </div>

                <div className="emptyspace">
                    <img id='esLeftDimond' alt='Left diamond' src={diamond} width={80.55} height={50.19}></img>
                    <img id='saprkleRight' alt='Right sparkle' src={sparkles} width={50} height={40}></img>
                </div>

            </div>
        </div>
        </>
    );
}

export default Chat
