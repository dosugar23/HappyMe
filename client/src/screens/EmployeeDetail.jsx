import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router";
import { URL } from "../utils/utils";
import axios from "axios";
import { customDate } from "../utils/utils";
import { Link } from "react-router-dom";

const EmployeeDetail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState({});
    const [listJob, setListJob] = useState([]);

    useEffect(() => {
        new Promise(async () => {
            await fetching();
            await getListJob();
        })
    },[])

    const fetching = async () => {
        try {
            const response = await axios.get(`${URL}/api/get-detail-users/${id}`);
            if (response) {
                setDetail(response.data.all);
            }
        } catch (error) {
            
        }
    }

    const getListJob = async () => {
        try {
            const response = await axios.get(`${URL}/api/get-list-job/${id}`);
            if (response) {
                setListJob(response.data);
            }
        } catch (error) {
            
        }
    }


  return (
    <div id="main-wrapper">
      <Header />
      <div>
        <div className="bg-light py-5">
          <div className="ht-30" />
          <div className="container">
            <div className="row">
              <div className="colxl-12 col-lg-12 col-md-12">
                <h1 className="ft-medium">Detail Company</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#">Company</a>
                    </li>
                    <li
                      className="breadcrumb-item active theme-cl"
                      aria-current="page"
                    >
                      Detail Company
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="ht-30" />
        </div>
        {/* ======================= Top Breadcrubms ======================== */}
        {/* ======================= Dashboard Detail ======================== */}
        <section className="middle">
          <div className="container">
            <div className="row align-items-start justify-content-between">
              <div className="col-12 col-md-12 col-lg-4 col-xl-4 text-center miliods">
                <div className="d-block border rounded mfliud-bot mb-4">
                  <div className="cdt_author px-2 pt-5 pb-4">
                    <div className="dash_auth_thumb rounded p-1 border d-inline-flex mx-auto mb-3">
                      <img
                        src={detail.avatar ?? ''}
                        className="img-fluid"
                        width={100}
                        alt=""
                      />
                    </div>
                    <div className="dash_caption mb-4">
                      <h4 className="fs-lg ft-medium mb-0 lh-1">
                        {detail.fullName}
                      </h4>
                      <span className="text-muted smalls">
                        <i className="lni lni-map-marker mr-1" />
                             {detail.address}
                      </span>
                    </div>
                    <div className="jb-list-01-title px-2">
                                          {
                                              detail?.skill?.map((e) => (
                                                <span className="mr-2 mb-2 d-inline-flex px-2 py-1 rounded theme-cl theme-bg-light" key={e}>
                                                {e}
                                              </span>
                                              ))
                      }
                     
                    </div>
                  </div>
                  <div className="cdt_caps">
                    <div className="job_grid_footer pb-3 px-3 d-flex align-items-center justify-content-between">
                      <div className="df-1 text-muted">
                        <i className="lni lni-briefcase mr-1" />
                        {detail.phone}
                      </div>
                      <div className="df-1 text-muted">
                        <i className="lni lni-laptop-phone mr-1" />
                        IT &amp; Software
                      </div>
                    </div>
                    <div className="job_grid_footer px-3 d-flex align-items-center justify-content-between">
                      <div className="df-1 text-muted">
                        <i className="lni lni-envelope mr-1" />
                            {detail.email}
                      </div>
                      <div className="df-1 text-muted">
                        <i className="lni lni-calendar mr-1" />
                            {detail.birthday}
                      </div>
                    </div>
                  </div>
                  <div className="cdt_caps py-5 px-3">
                    <a
                      href={`tel:+${detail.phone}`}
                      className="btn btn-md theme-bg text-light rounded full-width"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-12 col-lg-8 col-xl-8">
                {/* row */}
                <div className="row align-items-start">
                  {/* About */}
                  <div className="abt-cdt d-block full-width mb-4">
                                      <h4 className="ft-medium mb-1 fs-md">About {detail.fullName}</h4>
                    <p>
                     {detail?.description ?? ''}
                    </p>
                  </div>
                  {/* Hobbies */}
                  {/* <div className="abt-cdt d-block full-width mb-4">
                    <h4 className="ft-medium mb-1 fs-md">Instructions</h4>
                    <div className="position-relative row">
                      <div className="col-lg-12 col-md-12 col-12">
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Strong core PHP Hands on experience.
                            </h6>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Strong Expertise in CodeIgniter Framework .
                            </h6>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Understanding of MVC design pattern.
                            </h6>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Expertise in PHP, MVC Frameworks and good
                              technology exposure of Codeigniter .
                            </h6>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Basic understanding of front-end technologies,
                              such as JavaScript, HTML5, and CSS3
                            </h6>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Good knowledge of relational databases, version
                              control tools and of developing web services.
                            </h6>
                          </div>
                        </div>
                        <div className="mb-2 mr-4 ml-lg-0 mr-lg-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-light-success theme-cl p-1 small d-flex align-items-center justify-content-center">
                              <i className="fas fa-check small" />
                            </div>
                            <h6 className="mb-0 ml-3 text-muted fs-sm">
                              Proficient understanding of code versioning tools,
                              such as Git.
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  {/* Award */}
                  <div className="abt-cdt d-block full-width mb-4">
                    <h4 className="ft-medium mb-1 fs-md">List Job</h4>
                    <div className="exslio-list mt-3">
                      <ul>
                                              {
                                                  listJob?.map((item) => (
                                                    <li key={item._id}>
                                                    <div className="esclio-110 bg-light rounded px-3 py-3">
                                                              <h4 className="mb-0 ft-medium fs-md">{item.nameJob}</h4>
                                                      <div className="esclio-110-info full-width mb-2">
                                                        <span className="text-muted mr-2">
                                                          <i className="lni lni-calendar mr-1" />
                                                          {customDate(item.createdAt) ?? ''}
                                                        </span>
                                                      </div>
                                                      <div className="esclio-110-decs full-width">
                                                        <p>
                                                          {
                                                            item.jobType
                                                                      } - {
                                                                          item.careerLevel
                                                          }
                                                                      <Link
                                                                          to={`/detail-job/${item._id}`}
                                                            className="theme-cl"
                                                          >
                                                            Read More..
                                                          </Link>
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </li>
                                                  ))
                        }
                     
                      </ul>
                    </div>
                  </div>
                </div>
                {/* row */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeDetail;
