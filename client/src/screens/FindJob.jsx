import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { message, Spin } from "antd";
import axios from "axios";
import { URL, formatTimeAgo } from "../utils/utils";
import { Link } from "react-router-dom";

const FindJob = () => {
  const [listJob, setListJob] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 2,
    total: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [formSearch, setFormSearch] = useState({
    key: "",
    zip: "",
    category: [],
    experience: [],
    jobLevel: [],
    salary: [],
  });

  useEffect(() => {
    new Promise(async () => {
      await fetchingList();
      await fetchingListCategory();
    });
  }, [pagination.current]);

  const fetchingList = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${URL}/api/get-show-all-job/${pagination.current}/${pagination.limit}`
      );
      if (res.status === 200) {
        console.log("====================================");
        console.log(res);
        console.log("====================================");
        setIsLoading(false);
        setListJob(res.data.items);
        setPagination({
          ...pagination,
          current: res.data.currentPage,
          total: res.data.totalPages,
        });
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

  const handleChange = (key, string, type) => {
    if (type === "text") {
      setFormSearch({
        ...formSearch,
        [key]: string.target.value,
      });
    } else {
      let listArr = [...formSearch[key]];
      // updateList(string, listArr);
      console.log("====================================");
      console.log(string);
      console.log("====================================");
      const index = listArr.indexOf(string);
      if (index !== -1) {
        listArr.splice(index, 1);
      } else {
        listArr.push(string);
      }

      setFormSearch({
        ...formSearch,
        [key]: listArr,
      });

      // if (key === 'experience') {
      //   let listArr = [...formSearch.experience];
      //   // updateList(string, listArr);
      //   console.log('====================================');
      //   console.log(string);
      //   console.log('====================================');
      //   const index = listArr.indexOf(string);
      //     if (index !== -1) {
      //       listArr.splice(index, 1);
      //     } else {
      //       listArr.push(string);
      //     }

      //   setFormSearch({
      //     ...formSearch,
      //     [key] : listArr
      //   })
      // }
    }
  };

  const handleClean = () => {
    setFormSearch({
      key: "",
      zip: "",
      category: [],
      experience: [],
      jobLevel: [],
      salary: [],
    })
  }

  const handleSearchJob = async(e) => {
    e.preventDefault();
    const formData = {
      'salary' : [],
      'category': [],
      'experience': [],
      'jobLevel': [],
    }

    if (formSearch.key) {
      formData['key'] = formSearch.key
    }
    if (formSearch.zip) {
      formData['zip'] = formSearch.zip
    }
    if (formSearch.category.length > 0) {
      formSearch.category.forEach((cat) => {
        formData['category'].push(cat);
      });
    }
    if (formSearch.experience.length > 0) {
      formSearch.experience.forEach((exp) => {
        formData['experience'].push(exp)
      });
    }
    if (formSearch.jobLevel.length > 0) {
      formSearch.jobLevel.forEach((level) => {
        formData['jobLevel'].push(level)
      });
    }
    if (formSearch.salary.length > 0) {
      formSearch.salary.forEach((sal) => {
        formData['salary'].push(sal)
      });
    }
    try {
      setIsLoading(true);
    const res = await axios.post(`${URL}/api/search-job/${pagination.current}`, formData);
    if (res) {
      setIsLoading(false)
      setListJob(res.data.items);
      setPagination({
        ...pagination,
        current: res.data.currentPage,
        total: res.data.totalPages,
      });
    }
    } catch (error) {
      message.error(error)
    }
  }


  return (
    <div id="main-wrapper">
      <Header />
      {/* ======================= Top Breadcrubms ======================== */}
      {/* ============================ Main Section Start ================================== */}
      <section className="bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="bg-white rounded">
                <div className="sidebar_header d-flex align-items-center justify-content-between px-4 py-3 br-bottom">
                  <h4 className="ft-medium fs-lg mb-0">Search Filter</h4>
                  <div className="ssh-header">
                    <a
                      onClick={handleClean}
                      className="clear_all ft-medium text-muted"
                    >
                      Clear All
                    </a>
                  </div>
                </div>
                {/* Find New Property */}
                <div className="sidebar-widgets miz_show">
                  <div className="search-inner">
                    <div className="filter-search-box px-4 pt-3 pb-0">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          value={formSearch.key}
                          onChange={(e) => handleChange("key", e, "text")}
                          placeholder="Search by keywords..."
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          value={formSearch.zip}
                          onChange={(e) => handleChange("zip", e, "text")}
                          className="form-control"
                          placeholder="Location, Zip.."
                        />
                      </div>
                    </div>
                    <div className="filter_wraps">
                      {/* Job categories Search */}
                      <div className="single_search_boxed px-4 pt-0 br-bottom">
                        <div className="widget-boxed-header">
                          <h4>
                            <a
                              className="ft-medium fs-md pb-0"
                              data-toggle="collapse"
                              aria-expanded="true"
                              role="button"
                            >
                              Job Categories
                            </a>
                          </h4>
                        </div>
                        <div className="widget-boxed-body show" id="categories">
                          <div className="side-list no-border">
                            {/* Single Filter Card */}
                            <div className="single_filter_card">
                              <div className="card-body p-0">
                                <div className="inner_widget_link">
                                  <ul className="no-ul-list filter-list">
                                    {listCategory.map((item) => (
                                      <li
                                        key={item.value}
                                        onClick={() =>
                                          handleChange(
                                            "category",
                                            item.value,
                                            "array"
                                          )
                                        }
                                      >
                                        <input
                                          className="checkbox-custom"
                                          value={item.value}
                                          checked={formSearch.category.includes(
                                            item.value
                                          )}
                                          type="checkbox"
                                        />
                                        <label
                                          htmlFor="a1"
                                          className="checkbox-custom-label"
                                        >
                                          {item.label}
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="single_search_boxed px-4 pt-0 br-bottom">
                        <div className="widget-boxed-header">
                          <h4>
                            <a
                              aria-expanded="false"
                              role="button"
                              className="ft-medium fs-md pb-0 collapsed"
                            >
                              Experience
                            </a>
                          </h4>
                        </div>
                        <div className="widget-boxed-body" id="experience">
                          <div className="side-list no-border">
                            {/* Single Filter Card */}
                            <div className="single_filter_card">
                              <div className="card-body p-0">
                                <div className="inner_widget_link">
                                  <ul className="no-ul-list filter-list">
                                    <li
                                      onClick={() =>
                                        handleChange("experience", 1, "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.experience.includes(
                                          1
                                        )}
                                        value={1}
                                        type="checkbox"
                                        defaultChecked
                                      />
                                      <label
                                        htmlFor="d1"
                                        className="checkbox-custom-label"
                                      >
                                        Beginner (54)
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("experience", 2, "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.experience.includes(
                                          2
                                        )}
                                        value={2}
                                        type="checkbox"
                                      />
                                      <label
                                        htmlFor="d2"
                                        className="checkbox-custom-label"
                                      >
                                        1+ Year (32)
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("experience", 3, "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.experience.includes(
                                          3
                                        )}
                                        value={3}
                                        type="checkbox"
                                      />
                                      <label
                                        htmlFor="d3"
                                        className="checkbox-custom-label"
                                      >
                                        2 Year (09)
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("experience", 4, "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.experience.includes(
                                          4
                                        )}
                                        value={4}
                                        type="checkbox"
                                      />
                                      <label
                                        htmlFor="d4"
                                        className="checkbox-custom-label"
                                      >
                                        3+ Year (16)
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("experience", 5, "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.experience.includes(
                                          5
                                        )}
                                        value={5}
                                        type="checkbox"
                                      />
                                      <label
                                        htmlFor="d5"
                                        className="checkbox-custom-label"
                                      >
                                        4+ Year (17)
                                      </label>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Job Level Search */}
                      <div className="single_search_boxed px-4 pt-0 br-bottom">
                        <div className="widget-boxed-header">
                          <h4>
                            <a
                              aria-expanded="false"
                              role="button"
                              className="ft-medium fs-md pb-0 collapsed"
                            >
                              Job Level
                            </a>
                          </h4>
                        </div>
                        <div className="widget-boxed-body" id="jblevel">
                          <div className="side-list no-border">
                            {/* Single Filter Card */}
                            <div className="single_filter_card">
                              <div className="card-body p-0">
                                <div className="inner_widget_link">
                                  <ul className="no-ul-list filter-list">
                                    <li
                                      onClick={() =>
                                        handleChange(
                                          "jobLevel",
                                          "Team Leader",
                                          "array"
                                        )
                                      }
                                    >
                                      <input
                                        checked={formSearch.jobLevel.includes(
                                          "Team Leader"
                                        )}
                                        className="checkbox-custom"
                                        type="checkbox"
                                        value={"Team Leader"}
                                      />
                                      <label
                                        htmlFor="f1"
                                        className="checkbox-custom-label"
                                      >
                                        Team Leader
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange(
                                          "jobLevel",
                                          "Manager",
                                          "array"
                                        )
                                      }
                                    >
                                      <input
                                        checked={formSearch.jobLevel.includes(
                                          "Manager"
                                        )}
                                        className="checkbox-custom"
                                        type="checkbox"
                                        value={"Manager"}
                                      />
                                      <label
                                        htmlFor="f2"
                                        className="checkbox-custom-label"
                                      >
                                        Manager
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange(
                                          "jobLevel",
                                          "Junior",
                                          "array"
                                        )
                                      }
                                    >
                                      <input
                                        checked={formSearch.jobLevel.includes(
                                          "Junior"
                                        )}
                                        className="checkbox-custom"
                                        type="checkbox"
                                        value={"Junior"}
                                      />
                                      <label
                                        htmlFor="f3"
                                        className="checkbox-custom-label"
                                      >
                                        Junior
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange(
                                          "jobLevel",
                                          "Senior",
                                          "array"
                                        )
                                      }
                                    >
                                      <input
                                        checked={formSearch.jobLevel.includes(
                                          "Senior"
                                        )}
                                        className="checkbox-custom"
                                        type="checkbox"
                                        value={"Senior"}
                                      />
                                      <label
                                        htmlFor="f4"
                                        className="checkbox-custom-label"
                                      >
                                        Senior
                                      </label>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Expected Salary Search */}
                      <div className="single_search_boxed px-4 pt-0">
                        <div className="widget-boxed-header">
                          <h4>
                            <a
                              aria-expanded="false"
                              role="button"
                              className="ft-medium fs-md pb-0 collapsed"
                            >
                              Expected Salary
                            </a>
                          </h4>
                        </div>
                        <div className="widget-boxed-body">
                          <div className="side-list no-border">
                            {/* Single Filter Card */}
                            <div className="single_filter_card">
                              <div className="card-body p-0">
                                <div className="inner_widget_link">
                                  <ul className="no-ul-list filter-list">
                                    <li
                                      onClick={() =>
                                        handleChange("salary", "120", "array")
                                      }
                                    >
                                      <input
                                        checked={formSearch.salary.includes(
                                          "120"
                                        )}
                                        className="checkbox-custom"
                                        type="checkbox"
                                        value={"120"}
                                        defaultChecked
                                      />
                                      <label
                                        htmlFor="g1"
                                        className="checkbox-custom-label"
                                      >
                                        $120k - $140k PA
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("salary", "140", "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.salary.includes(
                                          "140"
                                        )}
                                        type="checkbox"
                                        value={"140"}
                                      />
                                      <label
                                        htmlFor="g2"
                                        className="checkbox-custom-label"
                                      >
                                        $140k - $150k PA
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("salary", "200", "array")
                                      }
                                    >
                                      <input
                                        checked={formSearch.salary.includes(
                                          "200"
                                        )}
                                        className="checkbox-custom"
                                        type="checkbox"
                                        value={"200"}
                                      />
                                      <label
                                        htmlFor="g5"
                                        className="checkbox-custom-label"
                                      >
                                        $200k - $250k PA
                                      </label>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleChange("salary", "250", "array")
                                      }
                                    >
                                      <input
                                        className="checkbox-custom"
                                        checked={formSearch.salary.includes(
                                          "250"
                                        )}
                                        type="checkbox"
                                        value={"250"}
                                      />
                                      <label
                                        htmlFor="g6"
                                        className="checkbox-custom-label"
                                      >
                                        $250k - $300k PA
                                      </label>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group filter_button pt-2 pb-4 px-4">
                      <button
                        type="submit"
                        onClick={handleSearchJob}
                        className="btn btn-md theme-bg text-light rounded full-width"
                      >
                        {listJob.length > 0 ? `${listJob.length} Result show` : 'Search'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sidebar End */}
            </div>
            {/* Item Wrap Start */}
            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                  <div className="row align-items-center justify-content-between mx-0 bg-white rounded py-2 mb-4">
                    <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12">
                      <h6 className="mb-0 ft-medium fs-sm">
                        {listJob.length} New Jobs Found
                      </h6>
                    </div>
                    <div className="col-xl-9 col-lg-8 col-md-7 col-sm-12">
                      <div className="filter_wraps elspo_wrap d-flex align-items-center justify-content-end">
                        <div className="single_fitres">
                          <Link
                            onClick={() => setShow(true)}
                            className={`simple-button mr-1  ${
                              show ? "theme-cl active" : ""
                            }`}
                          >
                            <i className="ti-layout-grid2" />
                          </Link>
                          <Link
                            onClick={() => setShow(false)}
                            className={`simple-button  ${
                              !show ? "theme-cl active" : ""
                            }`}
                          >
                            <i className="ti-view-list" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* All jobs */}
              <div className="row">
                {show ? (
                  // <>
                  // isLoading && (
                  //   <Spin className="flex justify-center items-center" />
                  // )
                  // </>
                  listJob.map((item) => (
                    <div
                      className="col-xl-4 col-lg-6 col-md-6 col-sm-12"
                      key={item._id}
                    >
                      <div className="job_grid border rounded ">
                        <div className="position-absolute ab-left">
                          <button
                            type="button"
                            className="p-3 border circle d-flex align-items-center justify-content-center bg-white text-gray"
                          >
                            <i className="lni lni-heart-filled position-absolute snackbar-wishlist" />
                          </button>
                        </div>
                        <div className="position-absolute ab-right">
                          <span className="medium theme-cl theme-bg-light px-2 py-1 rounded">
                            {item.jobType ?? ""}
                          </span>
                        </div>
                        <div className="job_grid_thumb mb-2 pt-10 px-3"></div>
                        <div className="job_grid_caption text-center pb-3 px-3">
                          <h4 className="mb-0 ft-medium medium">
                            <a
                              href="employer-detail.html"
                              className="text-dark fs-md"
                            >
                              {item.nameJob.slice(0, 15) + "..." ?? ""}
                            </a>
                          </h4>
                          <div className="jbl_location">
                            <i className="lni lni-map-marker mr-1" />
                            <span>
                              {item.address.slice(0, 15) + "..." ?? ""}
                            </span>
                          </div>
                        </div>
                        <div className="job_grid_footer pt-2 pb-4 px-3 d-flex align-items-center justify-content-between">
                          <div className="row">
                            <div className="df-1 text-muted col-6 mb-2">
                              <i className="lni lni-briefcase mr-1" />
                              {item.jobType ?? ""}
                            </div>
                            <div className="df-1 text-muted col-6 mb-2">
                              <i className="lni lni-wallet mr-1" />
                              {item.moneyWork} $
                            </div>
                            <div className="df-1 text-muted col-6">
                              <i className="lni lni-users mr-1" />
                              {item.proposal.length} Opp.
                            </div>
                            <div className="df-1 text-muted col-6">
                              <i className="lni lni-timer mr-1" />
                              {formatTimeAgo(item.createdAt)}
                            </div>
                            <div className="df-1 text-dark ft-medium col-12 mt-3">
                              <Link
                                to={`/detail-job/${item._id}`}
                                className="btn gray apply-btn rounded full-width"
                              >
                                Apply Job
                                <i className="lni lni-arrow-right-circle ml-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {/* Single job */}
                    {isLoading && (
                      <Spin className="flex justify-center items-center" />
                    )}
                    {listJob.map((item) => (
                      <div
                        key={item._id}
                        className="job_grid d-block border rounded px-3 pt-3 pb-2"
                      >
                        <div className="jb-list01">
                          <div className="jb-list-01-title">
                            <h5 className="ft-medium mb-1">
                              <Link to={`/detail-job/${item._id}`}>{item.nameJob}</Link>
                            </h5>
                          </div>
                          <div className="jb-list-01-info d-block mb-3">
                            <span className="text-muted mr-2">
                              <i className="lni lni-map-marker mr-1" />
                              {item.address}
                            </span>
                            <span className="text-muted mr-2">
                              <i className="lni lni-briefcase mr-1" />
                              {item.jobType}
                            </span>
                            <span className="text-muted mr-2">
                              <i className="lni lni-star-filled mr-1" />
                              {item.careerLevel}
                            </span>
                            <span className="text-muted mr-2">
                              <i className="lni lni-money-protection mr-1" />
                              {item.timeWork} - {item.moneyWork}$
                            </span>
                          </div>
                          <div className="jb-list-01-title">
                            {item?.skill?.slice(0, 5).map((e) => (
                              <span
                                key={e}
                                className="mr-2 mb-2 d-inline-flex px-2 py-1 rounded theme-bg-light"
                              >
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <ul className="pagination">
                    <li className="page-item">
                      <a
                        className="page-link"
                        aria-label="Previous"
                        onClick={() =>
                          setPagination({
                            ...pagination,
                            current: pagination.current - 1,
                          })
                        }
                      >
                        <span className="fas fa-arrow-circle-left" />
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    {Array.from({ length: pagination.total }, (_, index) => (
                      <li
                        className={`page-item ${
                          pagination.current === index + 1 ? "active" : ""
                        }`}
                        key={index}
                      >
                        <a
                          className="page-link"
                          onClick={() =>
                            setPagination({
                              ...pagination,
                              current: index + 1,
                            })
                          }
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}
                    <li className="page-item">
                      <a
                        className="page-link"
                        aria-label="Next"
                        onClick={() =>
                          setPagination({
                            ...pagination,
                            current: pagination.current + 1,
                          })
                        }
                      >
                        <span className="fas fa-arrow-circle-right" />
                        <span className="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ============================ Main Section End ================================== */}
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

export default FindJob;
