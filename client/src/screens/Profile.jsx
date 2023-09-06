import Header from "../components/Header";
import Footer from "../components/Footer";
import HeaderOther from "../components/HeaderOther";
import SideBar from "../components/SideBar";

import { useState, useEffect } from "react";
import axios from "axios";
import { URL, getDataLocalStorage } from "../utils/utils";
import { Select, message } from "antd";
import styled from 'styled-components';
import { PayPalButtons } from "@paypal/react-paypal-js";


const CustomSelect = styled(Select)`

`;

const Profile = () => {
  const [profile, setProfile] = useState({});
    const [listCategory, setListCategory] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [money, setMoney] = useState(1000);
  const [me, setMe] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [info, setInfo] = useState({
    account: '',
    amount: 0,
    bank: ''
  });




  useEffect(() => {
    const fetchData = async () => {
      const user = getDataLocalStorage("user:detail");
      if (user) {
        await fetchApi(user.id);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    new Promise(async () => {
      await fetchingListCategory();
    });
  }, []);
    
    const fetchApi = async (id) => {
        setIsSubmit(true);
    try {
      const res = await axios.get(`${URL}/api/get-user/${id}`);
        if (res) {
            setProfile(res.data);
            setIsSubmit(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    };

    const handleChangeData = (key, string) => {
        setProfile({
            ...profile,
            [key] : string
        })
    }   
    
    const fetchingListCategory = async () => {
        const res = await axios.get(`${URL}/api/get-all-categories`);
        if (res) {
          const data = res.data.all?.map((item) => ({
            label: item.nameCategory,
            value: item.nameCategory,
          }));
          setListCategory(data);
        }
    };
    
    const handleUpdateUser = async (e) => {
        e.preventDefault()
        setIsSubmit(true);
        const user = getDataLocalStorage("user:detail");
        try {
            const res = await axios.put(`${URL}/api/update-user/${user.id}`, {
                ...profile
            });
            if (res) {
                setIsSubmit(false);
                setProfile({
                    ...res.data
                });
                message.success('Update user success !')
            }
        } catch (error) {
            message.error('Error Server');
        }
  }
  
  const createOrder = (data, actions) => {
    // Implement your logic to create an order on your server
    // and return the order ID.
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: money, // Set the payment amount
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    // Implement your logic for a successful transaction
    return actions.order.capture().then(async function (details) {
      // Handle the successful payment
      const calMoney = profile.money ? profile.money + money : 0 + money;
       try {
         const res = await axios.put(`${URL}/api/add-money`, {
          idUser : me.id,
          money : calMoney
         });

         if (res.status === 200) {
           window.location.reload();
         }

       } catch (error) {
        
       }

    });
  };

  const handleChange = (event) => {
    const { value } = event.target;

    if (value.length <= 10) {
      setInfo({ ...info, account: event.target.value })
    }
    
  }

  const renderHtml = (account, amount, bank) => {
    return `
      <h2>You just made a withdrawal </h2>
        <ul>
          <li>TK : ${account}</li>
          <li>Bank : ${bank}</li>
          <li>Amount :${amount} $</li>
          <li>Status : Success </li>
        </ul>
    `
  }

  const handleWithDraw = async (e) => {
    e.preventDefault()
    if (!info.account || !info.amount || !info.bank) {
        message.error('Please fill all input before draw money') 
        return;
    }
    
    if (info.amount > profile.money || profile.money < 1) {
      message.error('Money not enough to draw')
      return;
    }

    try {
      const res = await axios.put(`${URL}/api/add-money`, {
        idUser : me.id,
        money: profile.money - info.amount
      });
      
      if (res.status === 200) {

        const sendContractPromise = axios.post(`${URL}/api/send-contract`, {
          to: profile.email,
          subject: 'Draw With Money',
          idJob: '1',
          text: renderHtml(info.account, info.amount, info.bank)
        });

        const date = Date.now();

        const addHistory = axios.post(`${URL}/api/add-history`, {
          name : me.email,
          date : date,
          money: info.amount,
          idUser: profile._id,
          account: info.account,
          bank: info.bank
        })
        message.success('Draw money success');
        }

    } catch (error) {
      
    } finally {
      window.location.reload();
    }

  }

  console.log('====================================');
  console.log(profile);
  console.log('====================================');

  return (
      <div id="main-wrapper">
          
          {
              isSubmit && (<div className="preloader"></div>)
          }
      <HeaderOther />
      <div className="dashboard-wrap bg-light">
        <SideBar />
        <div className="dashboard-content">
          <div className="dashboard-tlbar d-block mb-5">
            <div className="row">
              <div className="colxl-12 col-lg-12 col-md-12">
                <h1 className="ft-medium">My Profile</h1>
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
                        My Profile
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
                  <div className="_dashboard_content_header br-bottom py-3 px-3">
                    <div className="_dashboard__header_flex">
                      <h4 className="mb-0 ft-medium fs-md">
                        <i className="fa fa-user mr-1 theme-cl fs-sm" />
                        My Account
                      </h4>
                    </div>
                  </div>
                  <div className="_dashboard_content_body py-3 px-3">
                    <form className="row">
                      <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                        <div className="custom-file avater_uploads">
                          <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                          />
                          {profile.avatar ? (
                            <div className="">
                              <img
                                src={profile.avatar}
                                alt=""
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                              <p className="uppercase font-bold">
                                {profile.role ?? ""}
                              </p>
                            </div>
                          ) : (
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              <i className="fa fa-user" />
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                        <div className="row">
                          <div className="col-xl-6 col-lg-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Full Name
                              </label>
                              <input
                                type="text"
                                onChange={(e) => handleChangeData('fullName', e.target.value)}
                                className="form-control rounded"
                                value={profile.fullName ?? ""}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Phone
                              </label>
                              <input
                                type="text"
                                onChange={(e) => handleChangeData('phone', e.target.value)}
                                className="form-control rounded"
                                value={profile.phone ?? ""}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Email
                              </label>
                              <input
                                type="email"
                                onChange={(e) => handleChangeData('email', e.target.value)}
                                className="form-control rounded"
                                value={profile.email ?? ""}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Address
                              </label>
                              <input
                                                              type="text"
                                                              onChange={(e) => handleChangeData('address', e.target.value)}
                                className="form-control rounded"
                                value={profile.address ?? ""}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Prefers
                              </label>
                              <CustomSelect
                                mode="multiple"
                                allowClear
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                onChange={(e) => handleChangeData('skill', e)}
                                value={profile.skill ?? []}
                                options={listCategory}
                              />
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                About Info
                              </label>
                              <textarea
                              onChange={(e) => handleChangeData('description', e.target.value)}
                                className="form-control with-light"
                                value={profile.description ?? ''}
                              />
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12">
                            <div className="form-group">
                              <button
                                                              type="submit"
                                                              onClick={handleUpdateUser}
                                className="btn btn-md ft-medium text-light rounded theme-bg"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {
                me.role === 'company' && (
                  <div className="col-lg-12 col-md-12">
                <div className="_dashboard_content bg-white rounded mb-4">
                  <div className="_dashboard_content_header br-bottom py-3 px-3">
                    <div className="_dashboard__header_flex">
                      <h4 className="mb-0 ft-medium fs-md">
                       
                       Deposit Money To Wallet 
                      </h4>
                    </div>
                  </div>
                  <div className="col-6">
                  <div className="_dashboard_content_body py-3 px-3">
                      {/* <input
                        type="number"
                        value={money}
                        onChange={(e) => setMoney(e.target.value)}
                      className="form-control rounded mb-3"
                    /> */}
                   
                          <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={(err) => console.log(err)}
                        />
              
                  
                  </div>
                            </div>
                </div>
              </div>
                )
              }
              {
                profile.role !== 'admin' && (
                  <div className="col-lg-12 col-md-12">
                <div className="_dashboard_content bg-white rounded mb-4">
                  <div className="_dashboard_content_header br-bottom py-3 px-3">
                    <div className="_dashboard__header_flex">
                      <h4 className="mb-0 ft-medium fs-md">
                        <i className="fas fa-lock mr-1 theme-cl fs-sm" />
                        Withdraw Money
                      </h4>
                    </div>
                  </div>
                  <div className="_dashboard_content_body py-3 px-3">
                    <form className="row">

                      <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="form-group">
                          <label className="text-dark ft-medium">Bank</label>
                          <select className="custom-select rounded" value={info.bank} onChange={(e) => setInfo({ ...info, bank: e.target.value})}>
                            <option value={''}></option>
                            <option value={'VCB'}>VCB</option>
                            <option value={'TP'}>TP</option>
                            <option value={'MB'}>MB</option>
                            <option value={'VB'}>VB</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12">
                        <div className="form-group">
                          <label className="text-dark ft-medium">
                            STK
                          </label>
                          <input
                            type="number"
                            value={info.account}
                            min={11}
                            onChange={(e) => handleChange(e)}
                            className="form-control rounded"
                          />
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="form-group">
                          <label className="text-dark ft-medium">
                            Amount To WithDraw
                          </label>
                          <input
                            type="number"
                            value={info.amount}
                            onChange={(e) => setInfo({ ...info, amount: e.target.value })}
                            className="form-control rounded"
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12">
                        <div className="form-group">
                          <button
                            type="submit"
                            className="btn btn-md ft-medium text-light rounded theme-bg"
                            onClick={(e) =>handleWithDraw(e)}
                          >
                            Draw
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
                )
              }
            </div>
          </div>
          {/* footer */}
          <div className="row">
            <div className="col-md-12">
              <div className="py-3">© 2023 HappyMe. Designed By Bao Nguyen.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
