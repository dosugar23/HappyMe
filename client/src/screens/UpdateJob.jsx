import SideBar from "../components/SideBar";
import HeaderOther from "../components/HeaderOther";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../assets/css/styles.css"
import { useState, useEffect,useRef } from "react";
import { URL, getDataLocalStorage } from "../utils/utils";
import axios from "axios";
import { message } from "antd";
import { useNavigate, useParams } from "react-router";

import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, theme } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

const UpdateJob = () => {
  const [post, setPost] = useState({
    title: "",
    jobType: "Internship",
    careLevel: "Beginner",
    category: "",
    experience: "",
    gender: "",
    timeWork: "",
    moneyWork: "",
    address: "",
    zipCode: "",
    // latitude: "",
    // longitude: "",
  });

    const [idJobUpdate, setIdJobUpdate] = useState("");
  const [listCategory, setListCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState("");
    const { id } = getDataLocalStorage("user:detail");
    const navigate = useNavigate();
    const { idPost } = useParams();
    const { token } = theme.useToken();
    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputVisible) {
        inputRef.current?.focus();
      }
    }, [inputVisible]);

    useEffect(() => {
        if (idPost) {
            new Promise(async () => {
              await fetchPost(idPost)
          })
      }  
    },[idPost])

    const handleClose = (removedTag) => {
      const newTags = tags.filter((tag) => tag !== removedTag);
      console.log(newTags);
      setTags(newTags);
    };

    const showInput = () => {
      setInputVisible(true);
    };

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
      if (inputValue && tags.indexOf(inputValue) === -1) {
        setTags([...tags, inputValue]);
      }
      setInputVisible(false);
      setInputValue('');
    };

    const forMap = (tag) => {
      const tagElem = (
        <Tag
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
        >
          {tag}
        </Tag>
      );
      return (
        <span
          key={tag}
          style={{
            display: 'inline-block',
          }}
        >
          {tagElem}
        </span>
      );
    };
    const tagChild = tags.map(forMap);
    const tagPlusStyle = {
      background: token.colorBgContainer,
      borderStyle: 'dashed',
    };

  useEffect(() => {
    new Promise(async () => {
      await fetchingListCategory();
    });
  }, []);

  const checkDataNotEmpty = (post) => {
    for (const key in post) {
      if (!post[key]) {
        return false;
      }
    }
    return true;
  };

  const handleChangeValue = (key, string) => {
    setPost({
      ...post,
      [key]: string,
    });
    };
    
    const fetchPost = async (idPost) => {
        setIsLoading(true);
        try {
            const resData = await axios.get(`${URL}/api/get-detail-job/${idPost}`);
            if (resData) {
                setIsLoading(false);
                const response = resData.data;

                setPost({
                    title: response.nameJob,
                    email: "",
                    jobType: response.jobType,
                    careLevel: response.careLevel,
                    category: response.category,
                    experience: response.experience,
                    gender: response.gender,
                    timeWork: response.timeWork,
                    moneyWork: response.moneyWork,
                    address: response.address,
                    zipCode: response.zipCode,
                    // latitude: response.latitude,
                    // longitude: response.longitude,
                });
                setIdJobUpdate(response._id);
                setTags(response.skill);
                setValue(response.description)
            }
        } catch (error) {
             message.error("Please enter the input");
        }
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

  const handleSubmitForm = async (e) => {
      e.preventDefault();

    if (!post.title || !post.jobType ||
        !post.careLevel ||
        !post.category ||
        !post.experience ||
        !post.gender ||
        !post.timeWork ||
        !post.moneyWork ||
        !post.address ||
        !post.zipCode 
        // ||
        // !post.latitude ||
        // !post.longitude
        ) {
      const param = {
        nameJob: post.title,
        description: value,
        timeWork: post.timeWork,
        moneyWork: post.moneyWork,
        skill: tags,
        status: false,
          ownerPerson: id,
          jobType: post.jobType ,
          careerLevel: post.careLevel ,
          experience: post.experience ,
          gender: post.gender ,
          address: post.address ,
          zipCode: post.zipCode ,
          // latitude: post.latitude ,
          // longitude: post.longitude ,
        };
        setIsLoading(true);
        const submitData = await axios.put(`${URL}/api/edit-job/${idJobUpdate}`, param);
        if (submitData) {
            // setIsLoading(false);
            message.success('update post success');
            resetData();
            navigate('/jobs', { replace: true });
        }
    } else {
      message.error("Please enter the input");
      return;
    }
    };
    
    const resetData = () => {
        setPost({
            title: "",
            email: "",
            jobType: "",
            careLevel: "",
            category: "",
            experience: "",
            gender: "",
            timeWork: "",
            moneyWork: "",
            address: "",
            zipCode: "",
            // latitude: "",
            // longitude: "",
        })
    }

  return (
    <div id="main-wrapper">
      {isLoading && <div className="preloader"></div>}
      <HeaderOther />

      <div className="dashboard-wrap bg-light">
        <SideBar />
        <div className="dashboard-content">
          <div className="dashboard-tlbar d-block mb-5">
            <div className="row">
              <div className="colxl-12 col-lg-12 col-md-12">
                <h1 className="ft-medium">Update A New Job</h1>
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
                        Update Job
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
                        <i className="fa fa-file mr-1 theme-cl fs-sm" />
                        Update Job
                      </h4>
                    </div>
                  </div>
                  <div className="_dashboard_content_body py-3 px-3">
                    <form className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12">
                        <div className="row">
                          <div className="col-xl-12 col-lg-12 col-md-12">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Job Title
                              </label>
                              <input
                                type="text"
                                className="form-control rounded"
                                placeholder="Title"
                                value={post.title}
                                onChange={(e) =>
                                  handleChangeValue("title", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12 col-md-12">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Job Description
                              </label>
                              <ReactQuill
                                className="rounded"
                                theme="snow"
                                value={value}
                                onChange={setValue}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Job Type
                              </label>
                              <select
                                className="form-control rounded"
                                value={post.jobType}
                                onChange={(e) =>
                                  handleChangeValue("jobType", e.target.value)
                                }
                              >
                                <option>Full Time</option>
                                <option>Part Time</option>
                                <option>Internship</option>
                                <option>Contract</option>
                                <option>Freelancing</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Career Level
                              </label>
                              <select
                                className="form-control rounded"
                                value={post.careLevel}
                                onChange={(e) =>
                                  handleChangeValue("careLevel", e.target.value)
                                }
                              >
                                <option>Begginer</option>
                                <option>Junior</option>
                                <option>Manager</option>
                                <option>Team leader</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Category
                              </label>
                              <select
                                className="form-control rounded"
                                value={post.category}
                                onChange={(e) =>
                                  handleChangeValue("category", e.target.value)
                                }
                              >
                                {listCategory.map((option) => (
                                    <option
                                        value={option.value}
                                    key={option.value}
                                    className={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Experience
                              </label>
                              <select
                                className="form-control rounded"
                                value={post.experience}
                                onChange={(e) =>
                                  handleChangeValue(
                                    "experience",
                                    e.target.value
                                  )
                                }
                              >
                                <option value={1}>Begginer</option>
                                <option value={2}>0 To 6 Month</option>
                                <option value={3}>1 Years</option>
                                <option value={4}>2 Years</option>
                                <option value={5}>3 Years</option>
                                <option value={6}>4 Years</option>
                                <option value={7}>5+ Years</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Gender
                              </label>
                              <select
                                className="form-control rounded"
                                value={post.gender}
                                onChange={(e) =>
                                  handleChangeValue("gender", e.target.value)
                                }
                              >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Price Offer
                              </label>
                              <input
                                type="number"
                                className="form-control rounded"
                                placeholder="$"
                                min={1}
                                value={post.moneyWork}
                                onChange={(e) =>
                                  handleChangeValue("moneyWork", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Skill
                              </label>
                              <div
        style={{
          marginBottom: 16,
        }}
      >
        <TweenOneGroup
          enter={{
            scale: 1,
            opacity: 0,
            type: 'from',
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === 'appear' || e.type === 'enter') {
              e.target.style = 'display: inline-block';
            }
          }}
          leave={{
            opacity: 0,
            width: 0,
            scale: 0,
            duration: 200,
          }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> New Skill
        </Tag>
      )}
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12 col-md-12">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Application Deadline
                              </label>
                              <input
                                type="date"
                                className="form-control rounded"
                                placeholder="dd-mm-yyyy"
                                min={new Date().toISOString().split('T')[0]}
                                value={post.timeWork}
                                onChange={(e) =>
                                  handleChangeValue("timeWork", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12 col-md-12">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Full Address
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="#10 Marke Juger, SBI Road"
                                value={post.address}
                                onChange={(e) =>
                                  handleChangeValue("address", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-12 col-md-12">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Zip Code
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Zip"
                                value={post.zipCode}
                                onChange={(e) =>
                                  handleChangeValue("zipCode", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          {/* <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Latitude
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Latitude"
                                value={post.latitude}
                                onChange={(e) =>
                                  handleChangeValue("latitude", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="form-group">
                              <label className="text-dark ft-medium">
                                Longitude
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Longitude"
                                value={post.longitude}
                                onChange={(e) =>
                                  handleChangeValue("longitude", e.target.value)
                                }
                              />
                            </div>
                          </div> */}
                          <div className="col-12">
                            <div className="form-group">
                              <button
                                className="btn btn-md ft-medium text-light rounded theme-bg"
                                onClick={(e) => handleSubmitForm(e)}
                              >
                                Update Case
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

export default UpdateJob;
