import Header from "../components/Header"
import Footer from "../components/Footer"

import Bn2 from "../assets/img/bn-2.png"
import Img1 from "../assets/img/img-1.png"
import Img2 from "../assets/img/img-2.png"
import Img3 from "../assets/img/img-3.png"

import { useState, useEffect } from "react"
import { getDataLocalStorage } from "../utils/utils"
import { URL } from "../utils/utils"
import axios from "axios"
import { message } from "antd"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const [list, setList] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [filter, setFilter] = useState({
    name: '',
    category: ''

  })

  const navigate = useNavigate();

  useEffect(() => {
    new Promise(async () => {
      await fetchingList();
      await fetchingListCategory();
    });
  }, []);

  const fetchingList = async () => {
    try {

      const res = await axios.get(
        `${URL}/api/get-show-all-job/${1}/${20}`
      );
      if (res.status === 200) {

        setList(res.data.items);
      }
    } catch (error) {
      message.error(error);
    }
  };

  
  const fetchingListCategory = async () => {
    const res = await axios.get(`${URL}/api/get-all-categories`);
    if (res) {
      const data = res.data.all?.map((item) => ({
        label: item.nameCategory,
        value: item._id,
      }));
      setListCategory(data);
    }
  };

  const handleFilter = () => {
    navigate(`/detail-filter/${filter.name ? filter.name : '0'}/${filter.category ? filter.category : '0'}`,{replace: true})
  }


    return (
        <div id="main-wrapper">
  <Header/>

  <div className="home-banner margin-bottom-0 intro-bg">
    <div className="container">
      <div className="row align-items-center justify-content-between">
        <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">
          <div className="banner_caption text-left mb-4">
            <div className="d-block mb-2"><span className="px-3 py-1 medium theme-bg-light theme-cl rounded">Your Trusted Mental Health Partner</span></div>
            <h1 className="banner_title ft-bold mb-1">Explore More Than<br /><span className="theme-cl">1000+</span> Therapists</h1>
            <p className="fs-md ft-regular">At Happy Me, we believe that everyone deserves to lead a fulfilling and content life. Let us be your trusted companion, guiding you towards a brighter and more harmonious existence. Take the first step today, and let us help you unlock the true potential of a happy, healthy you. Your happiness is our priority, and we are here to make sure you find it - one step at a time.</p>
          </div>
          <form className="bg-white rounded p-1">
            <div className="row no-gutters">
              <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
                <div className="form-group mb-0 position-relative">
                  <input type="text" className="form-control lg left-ico" value={filter.name} onChange={(e) => setFilter({...filter, name: e.target.value})} placeholder="Symptoms, Keywords, or Categories" />
                  <i className="bnc-ico lni lni-search-alt" />
                </div>
              </div>
              <div className="col-xl-5 col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group mb-0 position-relative">
                  <select className="custom-select lg b-0" value={filter.category} onChange={(e) => setFilter({...filter, category: e.target.value})}>
                    <option value=''>---------</option>
                          {
                            listCategory.map((item) => (
                              <option value={item.value} key={item.value}>{ item.label}</option>
                            ))
                    }
                    
                  </select>
                </div>
              </div>
              <div className="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-12">
                <div className="form-group mb-0 position-relative">
                  <button className="btn full-width custom-height-lg theme-bg text-white fs-md" type="button" onClick={handleFilter}>Find Cases</button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">
          <div className="bnr_thumb position-relative">
            <img src={Bn2} className="img-fluid bnr_img" alt="" />
            <div className="list_crs_img">
                    <img src={Img1} className="img-fluid elsio cirl animate-fl-y" alt="" />
              <img src={Img3} className="img-fluid elsio arrow animate-fl-x" alt="" />
              <img src={Img2} className="img-fluid elsio moon animate-fl-x" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ======================= Home Banner ======================== */}
  {/* ================================ Tag Award ================================ */}
  <section className="p-0">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="crp_box fl_color ovr_top">
            <div className="row align-items-center">
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <div className="dro_140">
                  <div className="dro_141 de"><i className="fa fa-journal-whills" /></div>
                  <div className="dro_142">
                    <h6>7421 Active jobs</h6>
                    <p>Duis aute irure dolor in voluptate velit esse cillum labore .</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <div className="dro_140">
                  <div className="dro_141 de"><i className="fa fa-business-time" /></div>
                  <div className="dro_142">
                    <h6>2410 Employers</h6>
                    <p>Duis aute irure dolor in voluptate velit esse cillum labore .</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                <div className="dro_140">
                  <div className="dro_141 de"><i className="fa fa-user-shield" /></div>
                  <div className="dro_142">
                    <h6>800k+ Enrolled</h6>
                    <p>Duis aute irure dolor in voluptate velit esse cillum labore .</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* ================================ Tag Award ================================ */}
  {/* ======================= Job List ======================== */}
  <section className="middle">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="sec_title position-relative text-center mb-5">
            <h6 className="text-muted mb-0">Recent Jobs</h6>
            <h2 className="ft-bold">Recent Active <span className="theme-cl">Listed Cases</span></h2>
          </div>
        </div>
      </div>
      {/* row */}
      <div className="row align-items-center">
        {/* Single */}
              {
                list.map((item) => (
                  <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12" key={item._id}>
                    <div className="jbr-wrap text-left border rounded">
                      <div className="cats-box mlb-res rounded bg-white d-flex align-items-center justify-content-between px-3 py-3">
                        <div className="cats-box rounded bg-white d-flex align-items-center">
                          <div className="text-center"><img src="assets/img/c-16.png" className="img-fluid" width={55} alt="" /></div>
                          <div className="cats-box-caption px-2">
                            <h4 className="fs-md mb-0 ft-medium">{item.nameJob} ({item.careerLevel})</h4>
                            <div className="d-block mb-2 position-relative">
                              <span className="text-muted medium"><i className="lni lni-map-marker mr-1" />{item.address}</span>
                              <span className="muted medium ml-2 theme-cl"><i className="lni lni-briefcase mr-1" />{item.jobType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mlb-last">
                          <Link to={`/detail-job/${item._id}`} className="btn gray ft-medium apply-btn fs-sm rounded">
                            Apply Case<i className="lni lni-arrow-right-circle ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
        }

      </div>

    </div>
  </section>
  {/* ======================= Job List ======================== */}
  {/* ======================= All category ======================== */}
  <section className="space gray">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="sec_title position-relative text-center mb-5">
            <h6 className="text-muted mb-0">Popular Categories</h6>
            <h2 className="ft-bold">Browse Top Categories</h2>
          </div>
        </div>
      </div>
      {/* row */}
      <div className="row align-items-center">
              {
                listCategory.map((item) => (
                  <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6" key={item.value}>
          <div className="cats-wrap text-center">
            <a href="job-search-v1.html" className="cats-box d-block rounded bg-white px-2 py-4">
              <div className="text-center mb-2 mx-auto position-relative d-inline-flex align-items-center justify-content-center p-3 theme-bg-light circle"><i className="lni lni-laptop-phone fs-lg theme-cl" /></div>
              <div className="cats-box-caption">
                          <h4 className="fs-md mb-0 ft-medium m-catrio">{item.label.slice(0, 50) + "..." ?? ''}</h4>
        
              </div>
            </a>
          </div>
        </div>
                ))
          }
      </div>
    </div>
  </section>


  <section className="space bg-cover" style={{background: '#03343b url(assets/img/landing-bg.png) no-repeat'}}>
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="sec_title position-relative text-center mb-5">
            <h6 className="text-light mb-0">Subscribr Now</h6>
            <h2 className="ft-bold text-light">Get All New Job Notification</h2>
          </div>
        </div>
      </div>
      <div className="row align-items-center justify-content-center">
        <div className="col-xl-7 col-lg-10 col-md-12 col-sm-12 col-12">
          <form className="bg-white rounded p-1">
            <div className="row no-gutters">
              <div className="col-xl-9 col-lg-9 col-md-8 col-sm-8 col-8">
                <div className="form-group mb-0 position-relative">
                  <input type="text" className="form-control lg left-ico" placeholder="Enter Your Email Address" />
                  <i className="bnc-ico lni lni-envelope" />
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-4">
                <div className="form-group mb-0 position-relative">
                  <button className="btn full-width custom-height-lg theme-bg text-light fs-md" type="button">Subscribe</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
        </section>
        <Footer/>
</div>

    )
}

export default Home