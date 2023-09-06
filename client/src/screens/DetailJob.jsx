import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { message, Spin } from "antd";
import axios from "axios";
import {
  URL,
  formatTimeAgo,
  showTitle,
  getDataLocalStorage,
} from "../utils/utils";
import { Link, useParams } from "react-router-dom";
import { pdfUpload } from "../utils/utils";

const DetailJob = () => {
  const [job, setJob] = useState({});
  const [listRelated, setListRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dataUser = getDataLocalStorage("user:detail");
  const [fileUpload, setFileUpload] = useState({
    file: "",
    fileName: "",
  });
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    new Promise(async () => {
      await fetching();
      await fetchingListRelated();
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [id]);

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

  const fetchingListRelated = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${URL}/api/get-related-job/${id}`);
      if (res) {
        setIsLoading(false);
        setListRelated(res.data);
      }
    } catch (error) {
      
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validate file type
    if (file && file.type === "application/pdf") {
      const fileSizeLimit = 5 * 1024 * 1024;
      if (file.size <= fileSizeLimit) {
        setFileUpload({
          file: file,
          fileName: file.name,
        });
      } else {
        message.error("Please select a file smaller than 5MB.");
      }
    } else {
      message.error("Please select a PDF file.");
    }
  };

  const handleApplyProposal = async () => {
    if (!fileUpload.file) {
      message.error("Please upload file PDF");
      return;
    }
    setIsLoading(true);
    const response = await pdfUpload(fileUpload.file);

    if (response) {
      setIsLoading(false);
      const publicId = response.url;

      const params = {
        file: publicId,
        status: "pending",
        idUser: dataUser.id,
        hourRate: "5h",
      };

      try {
        const res = await axios.post(
          `${URL}/api/apply-proposals/${id}`,
          params
        );
        if (res.status === 200) {
          message.success('Sent Proposal success');
          await fetching();
        }
      } catch (error) {
        message.error("You have submitted");
      }
    }
  };

  return (
    <div id="main-wrapper">
      {isLoading && <div className="preloader"></div>}
      <Header />
      {/* ============================================================== */}

      <div className="bg-light rounded py-5" style={{ marginTop: "70px" }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
              <div className="jbd-01 d-flex align-items-center justify-content-between">
                <div className="jbd-flex d-flex align-items-center justify-content-start">
                  <div className="jbd-01-caption pl-3">
                    <div className="tbd-title">
                      <h4 className="mb-0 ft-medium fs-md">
                        {job.nameJob ?? ""}
                      </h4>
                    </div>
                    <div className="jbl_location mb-3">
                      <span>
                        <i className="fa-solid fa-location-dot" />
                        {job.address ?? ""}
                      </span>
                      <span className="ml-3">
                        <i className="fa-solid fa-money-bill"></i>
                        {job.moneyWork ?? ""}$
                      </span>
                    </div>
                    <div className="jbl_info01">
                      <span className="px-2 py-1 ft-medium medium text-light theme-bg rounded mr-2">
                        {job.jobType ?? ""}
                      </span>
                      <span className="px-2 py-1 ft-medium medium text-light bg-warning rounded mr-2">
                        {job.careerLevel ?? ""}
                      </span>
                      <span className="px-2 py-1 ft-medium medium text-light bg-purple rounded">
                        {job.timeWork ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="jbd-01-right text-right">
                  <div className="jbl_button mb-2">
                    <a className="btn btn-md rounded theme-bg-light theme-cl fs-sm ft-medium">
                      {formatTimeAgo(job.createdAt ?? "")}
                    </a>
                  </div>
                  <div className="jbl_button">
                    <Link to={`/employee-detail/${job.ownerPerson}`} className="btn btn-md rounded bg-white border fs-sm ft-medium">
                      View Company
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ======================= Searchbar Banner ======================== */}
      {/* ============================ Job Details Start ================================== */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
              <div className="rounded mb-4">
                <div className="jbd-01 pr-3">
                  <div className="jbd-details mb-4">
                    <h5 className="ft-medium fs-md">Job description</h5>
                    <div
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>
                  <div className="jbd-details mb-4">
                    <h5 className="ft-medium fs-md">Skills Required</h5>
                    <div className="other-details">
                      <div className="details ft-medium">
                        <label className="text-muted">Role</label>
                        <span className="text-dark">
                          {job.careerLevel ?? ""}
                        </span>
                      </div>
                      <div className="details ft-medium">
                        <label className="text-muted">Experience</label>
                        <span className="text-dark">
                          {showTitle(job.experience) ?? ""}
                        </span>
                      </div>
                      <div className="details ft-medium">
                        <label className="text-muted">Gender</label>
                        <span className="text-dark">{job.gender ?? ""}</span>
                      </div>
                      <div className="details ft-medium">
                        <label className="text-muted">Salary</label>
                        <span className="text-dark">
                          {job.moneyWork ?? ""}$
                        </span>
                      </div>
                      <div className="details ft-medium">
                        <label className="text-muted">Zip Code</label>
                        <span className="text-dark">
                          {job.zipCode ?? ""} - {job.address ?? ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="jbd-details mb-1">
                    <h5 className="ft-medium fs-md">Key Skills</h5>
                    <ul className="p-0 skills_tag text-left">
                      {job?.skill?.map((item) => (
                        <li>
                          <span className="px-2 py-1 medium skill-bg rounded text-dark">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="jbd-02 pt-4 pr-3">
                  <div className="jbd-02-flex d-flex align-items-center justify-content-between">
                    <div className="jbl_button mb-2">
                      <a
                        href="#"
                        className="btn btn-md rounded gray fs-sm ft-medium mr-2"
                      >
                        Save This Job
                      </a>
                      <a
                        href="#"
                        className="btn btn-md rounded theme-bg text-light fs-sm ft-medium"
                      >
                        Apply Job
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
              <div className="jb-apply-form bg-white shadow rounded py-3 px-4 box-static">
                <h4 className="ft-medium fs-md mb-3">Intrested in this job?</h4>
                <form className="_apply_form_form">
                  {job.proposal &&
                  job.proposal.length > 0 &&
                  job.proposal.find((el) => el.idUser._id == dataUser.id) ? (
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-md rounded theme-bg text-light ft-medium fs-sm full-width"
                      >
                        YOU HAS APPLY
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="text-dark mb-1 ft-medium medium">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          placeholder="First Name"
                          value={dataUser.fullName}
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-dark mb-1 ft-medium medium">
                          Your Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          disabled
                          value={dataUser.email}
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-dark mb-1 ft-medium medium">
                          Phone Number:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={dataUser.phone}
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-dark mb-1 ft-medium medium">
                          Upload Resume:
                          <small className="medium ft-medium">pdf</small>
                        </label>
                        <div className="custom-file">
                          <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="customFile"
                          >
                            Choose file
                          </label>
                        </div>
                        {fileUpload.fileName && (
                          <label className="text-dark mb-1 ft-medium medium">
                            Name File:
                            <small className="medium ft-medium">
                              {fileUpload.fileName}
                            </small>
                          </label>
                        )}
                      </div>
                      <div className="form-group">
                        <div className="terms_con">
                          <input
                            id="aa3"
                            className="checkbox-custom"
                            name="Coffee"
                            onChange={() => setAgree(!agree)}
                            type="checkbox"
                          />
                          <label
                            htmlFor="aa3"
                            className="checkbox-custom-label"
                          >
                            I agree to pirvacy policy
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <button
                          type="button"
                          disabled={agree}
                          className="btn btn-md rounded theme-bg text-light ft-medium fs-sm full-width"
                          onClick={handleApplyProposal}
                        >
                          Apply For This Job
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ============================ Job Details End ================================== */}
      {/* ======================= Related Jobs ======================== */}
      <section className="space min gray">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="sec_title position-relative text-center mb-5">
                <h6 className="text-muted mb-0">Related Jobs</h6>
                <h2 className="ft-bold">All Related Listed jobs</h2>
              </div>
            </div>
          </div>
          {/* row */}
          <div className="row align-items-center">
            
            {
              listRelated.length > 0 && listRelated.map((i) => (
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={i._id}>
              <div className="job_grid border rounded ">
                
                <div className="position-absolute ab-right">
                  <span className="medium theme-cl theme-bg-light px-2 py-1 rounded">
                    {i.jobType}
                  </span>
                </div>
                <div className="job_grid_thumb mb-3 pt-5 px-3">
                 
                </div>
                <div className="job_grid_caption text-center pb-5 px-3">
                  <h6 className="mb-0 lh-1 ft-medium medium">
                        <Link to={`/detail-job/${i._id}`} className="text-muted medium">
                          {
                            i.careerLevel
                          }
                        </Link>
                  </h6>
                  <h4 className="mb-0 ft-medium medium">
               
                        <Link to={`/detail-job/${i._id}`} className="text-dark fs-md">{i.nameJob}</Link>
                  </h4>
                  <div className="jbl_location">
                    <i className="lni lni-map-marker mr-1" />
                    <span>{i.address}</span>
                  </div>
                </div>
                <div className="job_grid_footer pb-4 px-3 d-flex align-items-center justify-content-between">
                  <div className="df-1 text-muted">
                    <i className="lni lni-wallet mr-1" />
                    {i.moneyWork}$
                  </div>
                  <div className="df-1 text-muted">
                    <i className="lni lni-timer mr-1" />{formatTimeAgo(i.createdAt)}
                  </div>
                </div>
              </div>
            </div>
              ))
            }

          </div>
          {/* row */}
        </div>
      </section>
      {/* ======================= Related Jobs ======================== */}
      {/* ======================= Newsletter Start ============================ */}
      <section
        className="space bg-cover"
        style={{
          background: "#03343b url(assets/img/landing-bg.png) no-repeat",
        }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="sec_title position-relative text-center mb-5">
                <h6 className="text-light mb-0">Subscribr Now</h6>
                <h2 className="ft-bold text-light">
                  Get All New Job Notification
                </h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-10 col-md-12 col-sm-12 col-12">
              <form className="bg-white rounded p-1">
                <div className="row no-gutters">
                  <div className="col-xl-9 col-lg-9 col-md-8 col-sm-8 col-8">
                    <div className="form-group mb-0 position-relative">
                      <input
                        type="text"
                        className="form-control lg left-ico"
                        placeholder="Enter Your Email Address"
                      />
                      <i className="bnc-ico lni lni-envelope" />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-4">
                    <div className="form-group mb-0 position-relative">
                      <button
                        className="btn full-width custom-height-lg theme-bg text-light fs-md"
                        type="button"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DetailJob;
