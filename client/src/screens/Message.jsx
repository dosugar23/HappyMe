import HeaderOther from "../components/HeaderOther";
import SideBar from "../components/SideBar";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { URL, getDataLocalStorage } from "../utils/utils";
import { Link } from "react-router-dom";
import { Spin, message, Modal, Popover  } from "antd";
import { io } from 'socket.io-client'
import ReactQuill from "react-quill";
import { TYPE_CONVERSATION } from "../utils/type";

import EffectCongratution from "../components/EffectCongratution";

const Message = () => {
  const [me, setMe] = useState(JSON.parse(localStorage.getItem('user:detail')))
  const [listConversation, setListConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCon, setLoadingCon] = useState(false);
  const [listMessage, setListMessage] = useState({});
  const [activeCon, setActiveCon] = useState("");
  const [formInput, setFormInput] = useState({
    input: "",
  });
  const [socket, setSocket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messageRef = useRef(null);
  const [form, setForm] = useState({
    email: '',
    name: '',
  });
  const [description, setDescription] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);
  const [isProposal, setIsSendProposal] = useState('pending');
  const [isShow, setIsShow] = useState(false);
  const [isShowLinkRoomMeeting, setIsShowLinkRoomMeeting] = useState(false); 
  const [detailJob, setDetailJob] = useState({});
  const [idJob, setIdJob] = useState("");
  const [profile, setProfile] = useState("");


  useEffect(() => {
    setSocket(io('http://localhost:8080'))
  }, []);

  useEffect(() => {
		messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
	}, [listMessage?.messages])

  useEffect(() => {
    socket?.emit('addUser', me?.id);
		socket?.on('getUsers', users => {
			console.log('activeUsers :>> ', users);
		})
		
    socket?.on('getMessage', data => {
      console.log("🚀 ~ file: Message.jsx:42 ~ useEffect ~ data:", data)

        setListMessage(prev => ({
          ...prev,
          messages: [...prev.messages, { user: data.user, message: data.message }]
        }))

		})
	}, [socket])


  useEffect(() => {
    const fetchData = async () => {
      const user = getDataLocalStorage("user:detail");
      if (user) {
        await fetching(user.id);
      }
    };

    fetchData();
  }, []);

  const fetchingCon = async (conversationId, receiver, isSendProposal,idJob) => {
    const user = getDataLocalStorage("user:detail");
    setLoadingCon(true);
    try {
      const res = await axios.get(
        `${URL}/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`
      );
      if (res) {
        setLoadingCon(false);
        setActiveCon(conversationId);
        setIsSendProposal(isSendProposal);
        setForm({
          id: receiver.receiverId,
          email: receiver.email,
          name: receiver.fullName,
        })
        setListMessage({ messages: res.data, receiver, conversationId });
        setIdJob(idJob);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetching = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/api/conversations/${id}`);
      if (res) {
        setLoading(false);
        setListConversation(res.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleSendMessage = async () => {
    setFormInput({
      input: ''
    });
    socket?.emit('sendMessage', {
			senderId: me?.id,
			receiverId: listMessage?.receiver?.receiverId,
			message : formInput.input,
			conversationId:activeCon
		});

    const param = {
      conversationId: activeCon,
      senderId: me?.id,
      message: formInput.input,
      receiverId: listMessage?.receiver?.receiverId,
    };
    const response = await axios.post(`${URL}/api/message`, param);
    if (response.status === 200) {
      setFormInput({
        input : ''
      })
    }
  };

  const handleOpenLinkRoom = async() => {
    setIsShowLinkRoomMeeting(true);
    const response = await axios.get(`${URL}/api/detail-conversations/${idJob}`);
    if (response) {
      setDetailJob(response.data);
    }
  }

  const sendMessWhenSubmitContract = async () => {

    socket?.emit('sendMessage', {
			senderId: me?.id,
			receiverId: listMessage?.receiver?.receiverId,
			message : `🚀 ~ ${me?.fullName} HAS SEND CONTRACT <br/> (${listMessage?.receiver?.fullName} please check email!)` ,
			conversationId:activeCon
		});

    const param = {
      conversationId: activeCon,
      senderId: me?.id,
      message: `🚀 ~ ${me?.fullName} HAS SEND CONTRACT <br/> (${listMessage?.receiver?.fullName} please check email!)` ,
      receiverId: listMessage?.receiver?.receiverId,
    };
    const response = await axios.post(`${URL}/api/message`, param);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const handleOk = async () => {
    if (!description) {
      message.error('Please fill all input');
      return;
    }
    setLoadingSend(true);

    try {
      const sendContractPromise = axios.post(`${URL}/api/send-contract`, {
        to: form.email,
        subject: 'Contract Form',
        idJob: activeCon,
        text: description
      });
  
      const editContractPromise = axios.put(`${URL}/api/edit-contract/${activeCon}`, {
        isSendProposal: 'has_send'
      });
  
      const [sendContractRes, editContractRes] = await Promise.all([sendContractPromise, editContractPromise]);
  
      // Handle the responses if needed
      if (sendContractRes.data) {
        localStorage.setItem('form_description', description);
        clean();
        setLoadingSend(false);
        setIsModalOpen(false);
        message.success('Send Success');

        await sendMessWhenSubmitContract();


      }

      if (editContractRes.data) {
        setIsSendProposal(editContractRes.data.isSendProposal)
      }
  
    } catch (error) {
      // Handle the error
      console.error('Error:', error);
    }
  };

  const clean = () => {
    setDescription('');
  }
  

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUseFormOld = () => {
    const form = localStorage.getItem('form_description') || '';
    setDescription(form);
  }

  const handleApplyContract = async() => {
    setLoadingSend(true);
    try {
    const editContractPromise = await axios.put(`${URL}/api/edit-contract/${activeCon}`, {
      isSendProposal: 'success'
    });
      
      if (editContractPromise) {
        setIsShow(true);
        setLoadingSend(false);
        message.success('You have accepted contract');
        setIsSendProposal(editContractPromise.data.isSendProposal)
      }
      
    } catch (error) {
      
    }
  }

  const handleCancelLinkMeet = () => {
    setIsShowLinkRoomMeeting(false);
  }

  const handleCopied = (id) => {

    const link = `http://127.0.0.1:5500/callVideo/lobby.html?name=${me.email}&room=${id}`;
    window.open(link, '_blank');
  }

  const handlePayment = async() => {
    if (!profile.money || profile.money < 1) {
      message.error('Please deposit money into wallet');
      return;
    }

    if (+detailJob.moneyWork > profile.money) {
      message.error('Please deposit money into wallet');
      return;
    }

    try {
      const payment = await axios.put(`${URL}/api/deposit-money`, {
        idUser : profile._id,
        money: profile.money - Number(detailJob.moneyWork),
        idReceive: form.id,
        newMoney : Number(detailJob.moneyWork)
      });
  
        message.success('Thanh toán thành công');
  
  
        try {
          const editContractPromise = await axios.put(`${URL}/api/edit-contract/${activeCon}`, {
            isSendProposal: 'has_payment'
          });
            
            if (editContractPromise) {
              setIsSendProposal(editContractPromise.data.isSendProposal)
  
              window.location.reload();
            }
            
          } catch (error) {
            
          }

    } catch (error) {
      
    }


  }

  useEffect(() => {
    const fetchData = async () => {
      const user = getDataLocalStorage("user:detail");
      if (user) {
        await fetchApi(user.id);
      }
    };

    fetchData();
  }, []);
    
    const fetchApi = async (id) => {
    try {
      const res = await axios.get(`${URL}/api/get-user/${id}`);
        if (res) {
            setProfile(res.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    };

  console.log('====================================');
  console.log('form', form);
  console.log('====================================');


  return (
    <div id="main-wrapper">
      {isShow && (
         <EffectCongratution
         isShow={isShow}
         setIsShow={(status) => setIsShow(status)}
       />
     )}
      <HeaderOther />
      <div className="dashboard-wrap bg-light">
        <SideBar />
        {loadingSend && <div className="preloader"></div>}
        <div className="dashboard-content">
          <div className="dashboard-tlbar d-block mb-5">
            <div className="row">
              <div className="colxl-12 col-lg-12 col-md-12">
                <h1 className="ft-medium">Messages</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item text-muted">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item text-muted">
                      <a href="#">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#" className="theme-cl">
                        Messages
                      </a>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="dashboard-widg-bar d-block">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="_dashboard_content bg-white rounded mb-4">
                  <div className="_dashboard_content_body">
                    {/* Convershion */}
                    <div className="messages-container margin-top-0">
                      <div className="messages-headline">
                        <h4>{listMessage?.messages && listMessage?.messages[0]?.nameConversation}
                          {
                             isProposal === TYPE_CONVERSATION.success && (
                              <span>
                          <svg  style={{ display: 'inline-block' }} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                          <linearGradient id="IMoH7gpu5un5Dx2vID39Ra_pIPl8tqh3igN_gr1" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9dffce"></stop><stop offset="1" stop-color="#50d18d"></stop></linearGradient><path fill="url(#IMoH7gpu5un5Dx2vID39Ra_pIPl8tqh3igN_gr1)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><linearGradient id="IMoH7gpu5un5Dx2vID39Rb_pIPl8tqh3igN_gr2" x1="13" x2="36" y1="24.793" y2="24.793" gradientUnits="userSpaceOnUse"><stop offset=".824" stop-color="#135d36"></stop><stop offset=".931" stop-color="#125933"></stop><stop offset="1" stop-color="#11522f"></stop></linearGradient><path fill="url(#IMoH7gpu5un5Dx2vID39Rb_pIPl8tqh3igN_gr2)" d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414	c0.391-0.391,1.024-0.391,1.414,0L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414	c0.391,0.391,0.391,1.024,0,1.414l-13,13C22.317,33.098,21.683,33.098,21.293,32.707z"></path>
                          </svg>
                        </span>
                            )
                          }
                        </h4>
                        <a href="#" className="message-action">
                          <i className="ti-trash" /> Delete Conversation
                        </a>
                      </div>

                      <div className="messages-container-inner">
                        {/* Messages */}
                        <div className="dash-msg-inbox">
                          {loading && (
                            <div className="col-12 text-center">
                              <Spin />
                            </div>
                          )}
                          <ul>
                            {listConversation.length > 0 &&
                              listConversation.map(
                                ({ conversationId, user, isSendProposal,idJob }, index) => (
                                  <li
                                    className={
                                      conversationId == activeCon
                                        ? "active-message"
                                        : ""
                                    }
                                    key={index}
                                  >
                                    <a
                                      href="#"
                                      onClick={() =>
                                        fetchingCon(conversationId, user, isSendProposal,idJob)
                                      }
                                    >
                                      <div className="dash-msg-avatar">
                                        <img src={user?.avatar ?? ""} alt="" />
                                        <span className="_user_status online" />
                                      </div>
                                      <div className="message-by">
                                        <div className="message-by-headline">
                                          <h5>{user?.fullName ?? ""}</h5>
                                          <span>2 hours ago</span>
                                        </div>
                                        {/* <p>
                                        Hello, I am a web designer with 5 year..
                                      </p> */}
                                      </div>
                                    </a>
                                  </li>
                                )
                              )}
                          </ul>
                        </div>

                        <div className="dash-msg-content height-25">
                          <>
                          {loadingCon && (
                            <div className="col-12 text-center">
                              <Spin />
                            </div>
                          )}
                            {listMessage.messages && (
                              <>
                                <div className="wrap-message">
                                  {
                                    listMessage.messages.length > 0 && listMessage.messages.map(({ message, user: { id, avatar } = {}, index }) => (
                                      <div className={id == me?.id ? 'message-plunch me' : 'message-plunch'} key={index}>
                                          {
                                            id != me?.id && (
                                    <div className="dash-msg-avatar">
                                              <img
                                            src={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
                                            alt=""
                                          />
                                    </div>
                                            )
                                      }

                                    <div className="dash-msg-text">
                                      <p>
                                           
                                            <div dangerouslySetInnerHTML={{ __html: message }} />
                                            <div ref={messageRef}></div>
                                      </p>
                                    </div>
                                  </div>
                                    ))
                                  }
                                </div>

                                {/* Reply Area */}
                                <div className="clearfix" />
                                {
                                  isProposal === TYPE_CONVERSATION.pending && me?.role == 'company' && (<div className="" onClick={() => setIsModalOpen(true)}>
                                  <div className="btn theme-bg text-white">
                                     Offer Contract
                                  </div>
                                </div>)
                                }
                                 {
                                  isProposal === TYPE_CONVERSATION.has_send && me?.role !== 'company' && (
                                    
                                        <Popover content={'Please check  email before apply this contract'}>
                                          <div className="btn theme-bg text-white" onClick={handleApplyContract}>
                                            Apply Contract
                                          </div>
                                            </Popover>
                              
                            )
                                }
                                <div className="message-reply">
                                  {
                                    (isProposal === TYPE_CONVERSATION.success || isProposal === TYPE_CONVERSATION.has_payment)  && (
                                      <button
                                    type="submit"
                                    className="btn theme-bg text-white mr-2"
                                    onClick={handleOpenLinkRoom}
                                  >
                                    <i className="lni lni-menu"></i>
                                  </button>
                                    )
                                }
                                  <input
                                    type="text"
                                    className="form-control with-light"
                                    placeholder="Your Message"
                                    value={formInput.input}
                                    onChange={(e) =>
                                      setFormInput((pre) => ({
                                        ...pre,
                                        input: e.target.value,
                                      }))
                                    }
                                  />
                                  <button
                                    type="submit"
                                    disabled={
                                      formInput.input.length > 0 ? false : true
                                    }
                                    className="btn theme-bg text-white"
                                    onClick={handleSendMessage}
                                  >
                                    <i className="lni lni-arrow-right"></i>
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* footer */}
          <div className="row">
            <div className="col-md-12">
              <div className="py-3">© 2023 HappyMe. Designed By Bao Nguyen.</div>
            </div>
          </div>
          <Modal title="Form send contract"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}>
            <div className="row">
              <div className="col-6">
                <label htmlFor="">Email Ứng Viên</label>
                    <input type="text" value={form.email} disabled className="form-control" />
              </div>
              <div className="col-6">
                <label htmlFor="">Tên Ứng Viên</label>
                    <input type="text" value={form.name} disabled className="form-control" />
              </div>
              <div className="col-12 mt-2">
              <label className="text-dark ft-medium">
                Email Description
                </label>
                <label htmlFor="text-dark ft-medium" onClick={handleUseFormOld} style={{ float: 'right', color: '#3498db', cursor: 'pointer' }}>
                      Use Form Old
                </label>
              <ReactQuill
                className="rounded"
                theme="snow"
                value={description}
                onChange={setDescription}
              />
              </div>

                    </div>
          </Modal>
          <Modal title="Room working"
            open={isShowLinkRoomMeeting}
            onOk={()=>setIsShowLinkRoomMeeting(false)}
            onCancel={handleCancelLinkMeet}>
            <div className="row">
              <div className="col-6">
                <label htmlFor="">Dự án</label>
                    <input type="text" value={listMessage?.messages && listMessage?.messages[0]?.nameConversation} disabled className="form-control" />
              </div>
              <div className="col-6">
                <label htmlFor="" onClick={() => handleCopied(listMessage.conversationId)}>Link room</label>
                    <input type="text" value={listMessage.conversationId} disabled className="form-control"/>
              </div>
              <div className="col-6">
                <label htmlFor="" >Money</label>
                    <input type="text" value={`${detailJob.moneyWork} $`} disabled className="form-control"/>
              </div>

              <div className="col-6">
                <label htmlFor="" >Time Work</label>
                    <input type="text" value={detailJob.timeWork} disabled className="form-control"/>
              </div>
              <div className="col-6">
                <label htmlFor="" >Status</label>
                    <input type="text" value={isProposal === TYPE_CONVERSATION.has_payment ? 'Đã thanh toán' : 'Chưa thanh toán'} disabled className="form-control"/>
                    
              </div>
              {
                me?.role == 'company' && isProposal === TYPE_CONVERSATION.success  && (
                  <div className="col-4">
                  <label htmlFor="" >Thanh toán</label>
                    <button className="btn theme-bg text-white" onClick={handlePayment}>Thanh toán</button>
                  </div>
                )
              }
          
              
                    </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Message;
