import HeaderOther from "../components/HeaderOther";
import SideBar from "../components/SideBar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { URL } from "../utils/utils";
import { Link } from "react-router-dom";
import { message } from "antd";

const PersonApply = () => {
  const [job, setJob] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
  const [itemChoose, setItemChoose] = useState({
    id: '',
    status: ''
  });
  const [emailSend, setEmailSend] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    new Promise(async () => {
      await fetching();
    });
  }, []);

  const fetching = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${URL}/api/get-detail-job/${id}`);
      if (res) {
        setIsLoading(false);
        setJob(res.data);
      }
    } catch (error) {}
    };
    
    const handleChangeStatus = (i) => {
        setIsOpen(true);
      setItemChoose({
        id: i._id,
        status: i.status
      });
      setEmailSend(i?.idUser?.email);
    }

    const changeStatusOption = (e) => {
        setItemChoose({
            ...itemChoose,
            status: e.target.value
        })
    }

    const formSubmit = async(e) => {
        e.preventDefault();
      setIsLoading(true);
        const submitUpdate = await axios.put(`${URL}/api/update-proposals/${id}/${itemChoose.id}`, {
            status : itemChoose.status
        });

      if (submitUpdate.status === 200) {
        const sendEmail = await axios.post(`${URL}/api/send-email`, {
          to: emailSend,
          subject: 'CHÚC MỪNG BẠN ĐÃ ĐƯỢC CHỌN LÀM ỨNG VIÊN CỦA CHÚNG TÔI',
          text: 'Bạn đã được chọn',
          nameJob: job.nameJob,
          idJob: job._id
        });
        setIsLoading(false);
            setIsOpen(false);
            message.success('Update status success');
            await fetching();
        }
  }
  
  const handleCreateConversation = async(idReceive) => {
    const user = JSON.parse(localStorage.getItem('user:detail'));
    
    try {
      const res = await axios.post(`${URL}/api/conversation`, {
        nameConversation: job.nameJob  ?? 'Job option',
        senderId: user.id,
        receiverId: idReceive,
        isSendProposal: 'pending',
        idJob: job._id
      });
  
      if (res.status === 200) {
        navigate('/list-message', {replace: true});
      }

    } catch (error) {
      navigate('/list-message', {replace: true});
    }
  }

  return (
    <div id="main-wrapper">
      <HeaderOther />

      <div className="dashboard-wrap bg-light">
        <SideBar />

        {isLoading ? (
          <div className="preloader"></div>
        ) : (
          <div className="dashboard-content">
            <div className="dashboard-tlbar d-block mb-5">
              <div className="row">
                <div className="colxl-12 col-lg-12 col-md-12">
                  <h1 className="ft-medium">{job.nameJob ?? ""}</h1>
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
                          List person apply
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
                  <div className="px-3 py-2 br-bottom br-top bg-white rounded mb-3">
                    <div className="flixors">
                      <div className="row align-items-center justify-content-between">
                        <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12">
                          <h6 className="mb-0 ft-medium fs-sm">
                            0{job?.proposal?.length ?? ""} New Applicants Found
                          </h6>
                        </div>
                        <div className="col-xl-9 col-lg-8 col-md-7 col-sm-12">
                          <div className="filter_wraps elspo_wrap d-flex align-items-center justify-content-end">
                            <div className="single_fitres mr-2">
                              <select className="custom-select simple">
                                <option value={1} selected>
                                  Default Sorting
                                </option>
                                <option value={2}>Short By Name</option>
                                <option value={3}>Short By Rating</option>
                                <option value={4}>Short By Trending</option>
                                <option value={5}>Shot By Recent</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="data-responsive">
                    {/* Single List */}

                    {job.proposal &&
                      job.proposal.length > 0 &&
                      job.proposal.map((i) => (
                        <div
                          className="dashed-list-wrap bg-white rounded mb-3"
                          key={i._id}
                        >
                          <div className="dashed-list-full bg-white rounded p-3 mb-3">
                            <div className="dashed-list-short d-flex align-items-center">
                              <div className="dashed-list-short-first">
                                <div className="dashed-avater">
                                  <img
                                    src={i.idUser.avatar ?? ""}
                                    className="img-fluid circle"
                                    width={70}
                                    height={70}
                                    style={{ 
                                      height: '70px',
                                      width: '70px',
                                      objectFit:'cover'
                                     }}
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className="dashed-list-short-last">
                                <div className="cats-box-caption px-2">
                                  <h4 className="fs-lg mb-0 ft-medium theme-cl">
                                    {i.idUser.fullName}
                                  </h4>
                                  <div className="d-block mb-2 position-relative">
                                    <span>
                                      <i className="lni lni-map-marker mr-1" />
                                      {i.idUser.phone}
                                    </span>
                                    <span className="ml-2">
                                      <i className="lni lni-briefcase mr-1" />
                                      {i.idUser.address}
                                    </span>
                                  </div>
                                  <div className="ico-content">
                                    <ul>
                                      <li>
                                        <Link
                                          to={i.file}
                                          target="_blank"
                                          className="px-2 py-1 medium bg-light-success rounded text-success"
                                        >
                                          <i className="lni lni-download mr-1" />
                                          Preview CV
                                        </Link>
                                      </li>
                                      <li>
                                        {
                                          i.status === 'accept' && (
                                            <a
                                          onClick={() => handleCreateConversation(i.idUser._id)}
                                          className="px-2 py-1 medium bg-light-info rounded text-info cursor-pointer"
                                        >
                                          <i className="lni lni-envelope mr-1" />
                                          Message
                                        </a>
                                          )
                                        }
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                      </div>
                                      {
                                              i.status === 'accept' && (
                                                <span className="p-2 circle text-light bg-success d-inline-flex align-items-center justify-content-center"><i className="fas fa-check"></i></span>
                                              )
                                          }
                            </div>
                            <div className="dashed-list-last">
                              <div className="text-left">
                                        
                                                <a
                                                href="#"
                                                onClick={()=> handleChangeStatus(i)}
                                                className="btn gray ft-medium apply-btn fs-sm rounded mr-1"
                                              >
                                                <i className="lni lni-arrow-right-circle mr-1" />
                                                Edit
                                              </a>
                                              
                                          
                                {/* <a
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#note"
                                  className="btn gray ft-medium apply-btn fs-sm rounded mr-1"
                                >
                                  <i className="lni lni-add-files mr-1" />
                                  Note
                                </a>
                                <a
                                  href="javascript:void(0);"
                                  className="btn gray ft-medium apply-btn fs-sm rounded"
                                >
                                  <i className="lni lni-heart mr-1" />
                                  Save
                                </a> */}
                              </div>
                            </div>
                              </div>
                              
                              
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            {/* footer */}
            <div className="row">
              <div className="col-md-12">
                <div className="py-3">
                © 2023 HappyMe. Designed By Bao Nguyen.
                </div>
              </div>
            </div>
          </div>
        )}
          </div>

          {
              isOpen && (
                <div className="modal fade show" id="edit" role="dialog" style={{ display:'revert', backgroundColor: '#00000080' }}>
                <div className="modal-dialog modal-xl login-pop-form" role="document">
                  <div className="modal-content" id="appeditmodal">
                    <div className="modal-headers">
                      <button type="button" className="close" onClick={() => setIsOpen(false)}>
                      <i className="far fa-times-circle"></i>
                      </button>
                    </div>
                    <div className="modal-body p-5">
                      <div className="text-center mb-4">
                        <h2 className="m-0 ft-regular">Edit Candidate Status</h2>
                      </div>
                      <form>				
                        <div className="form-group">
                          <select value={itemChoose.status} onChange={(e) => changeStatusOption(e)} className="form-control rounded">
                            <option value={'pending'}>Pending</option>
                            <option value={'accept'}>Accept</option>
                            {/* <option value={'cancel'}>Cancel</option> */}
                          </select>
                        </div>
                        <div className="form-group">
                          <button type="submit" className="btn btn-md full-width theme-bg text-light fs-md ft-medium" onClick={(e) => formSubmit(e)}>Save Status</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              )
          }

          
    </div>
  );
};

export default PersonApply;
