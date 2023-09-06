import HeaderOther from "../components/HeaderOther";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import { URL, getDataLocalStorage } from "../utils/utils";
import { Select, message } from "antd";
import styled from 'styled-components';


const ChangePassWord = () => {
    const [profile, setProfile] = useState("");
    const [listCategory, setListCategory] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [replyPass, setReplyPass] = useState('');

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
        setIsSubmit(true);
    try {
      const res = await axios.get(`${URL}/api/get-user/${id}`);
        if (res) {
            setProfile(res.data.password);
            setIsSubmit(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        // setIsSubmit(true);
        // const user = getDataLocalStorage("user:detail");
        // try {
        //     const res = await axios.put(`${URL}/api/update-user/${user.id}`, {
        //         ...profile
        //     });
        //     if (res) {
        //         setIsSubmit(false);

        //         message.success('Update password success !')
        //     }
        // } catch (error) {
        //     message.error('Error Server');
        // }
    }

  return (
    <div id="main-wrapper">
      <HeaderOther />

      <div className="dashboard-wrap bg-light">
        <a
          className="mobNavigation"
          data-toggle="collapse"
          href="#MobNav"
          role="button"
          aria-expanded="false"
          aria-controls="MobNav"
        >
          <i className="fas fa-bars mr-2" />
          Dashboard Navigation
        </a>
        <SideBar />
        <div className="dashboard-content">
          <div className="dashboard-tlbar d-block mb-5">
            <div className="row">
              <div className="colxl-12 col-lg-12 col-md-12">
                <h1 className="ft-medium">Change Password</h1>
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
                        Change Password
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
                        <i className="fa fa-lock mr-1 theme-cl fs-sm" />
                        Change Password
                      </h4>
                    </div>
                  </div>
                  <div className="_dashboard_content_body py-3 px-3">
                    <form className="row">
                      <div className="col-xl-8 col-lg-9 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label className="text-dark ft-medium">
                            Old Password
                          </label>
                        <input
                            disabled
                            type="password"
                            value={profile}
                            className="form-control rounded"
                            placeholder
                          />
                        </div>
                      </div>
                      <div className="col-xl-8 col-lg-9 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label className="text-dark ft-medium">
                            New Password
                          </label>
                          <input
                            type="password"
                                                      value={newPass}
                                                      onChange={(e) => setNewPass(e.target.value)}
                            className="form-control rounded"
                            placeholder
                          />
                        </div>
                      </div>
                      <div className="col-xl-8 col-lg-9 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label className="text-dark ft-medium">
                            Confirm Password
                          </label>
                          <input
                                                      type="password"
                                                      value={replyPass}
                                                      onChange={(e) => setReplyPass(e.target.value)}
                            className="form-control rounded"
                            placeholder
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12">
                        <div className="form-group">
                          <button
                                                      type="submit"
                                                      onClick={handleSubmit}
                            className="btn btn-md ft-medium text-light rounded theme-bg"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="py-3">© 2023 HappyMe. Designd By Bao Nguyen.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassWord;
