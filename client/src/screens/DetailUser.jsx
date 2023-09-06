import { useEffect, useState } from "react";
import HeaderOther from "../components/HeaderOther";
import { useParams } from "react-router";
import { URL } from "../utils/utils";
import axios from "axios";
import { customDate } from "../utils/utils";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";

const DetailUser = () => {
    const { id, role } = useParams();
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
        if (role === 'freelance') {
            try {
                const response = await axios.get(`${URL}/api/get-list-job-has-send/${id}`);
                if (response) {
                    console.log(response);
                    setListJob(response.data);
                }
            } catch (error) {
                
            }
        } else {
            try {
                const response = await axios.get(`${URL}/api/get-list-job/${id}`);
                if (response) {
                    console.log(response);
                    setListJob(response.data);
                }
            } catch (error) {
                
            }
       }
    }


  return (
      <div id="main-wrapper">
      {/* Start Navigation */}
      <HeaderOther />
      {/* End Navigation */}

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
                      Contact Member
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
                
                  <div className="abt-cdt d-block full-width mb-4">
                                          <h4 className="ft-medium mb-1 fs-md">{role === 'freelance' ? 'List Job Has Send' : 'List Owner Job'}</h4>
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
    </div>
  );
};

export default DetailUser;
