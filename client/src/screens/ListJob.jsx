import HeaderOther from "../components/HeaderOther";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDataLocalStorage, URL, customDate } from "../utils/utils";
import axios from "axios";
import { Spin, message, Popconfirm  } from "antd";

const ListJob = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = getDataLocalStorage("user:detail");
      if (user) {
        await fetchingList(user.id);
      }
    };

    fetchData();
  }, []);

  const fetchingList = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/api/get-list-job/${id}`);
      if (res) {
        setLoading(false);
        setList(res.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    };
    
    const confirm = async(idDelete) => {
        const res = await axios.delete(`${URL}/api/delete-job/${idDelete}`);
        if (res.status === 200) {
            const user = getDataLocalStorage("user:detail");
            if (user) {
                await fetchingList(user.id);
            }
            message.success('Delete job success');
        }
    };
    
      const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
      };

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
          <div className="dashboard-tlbar d-block mb-5">
            <div className="row">
              <div className="colxl-12 col-lg-12 col-md-12">
                <h1 className="ft-medium">Manage Cases</h1>
                <div className="float-right">
                  <Link
                    to={"/create-job"}
                    className="theme-bg text-light rounded px-3 py-2 ft-medium"
                  >
                    Create Case
                  </Link>
                </div>
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
                        Manage Cases
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
                <div className="mb-4 tbl-lg rounded overflow-hidden">
                  <div className="table-responsive bg-white">
                    <table className="table">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Title</th>
                          <th scope="col">Filled</th>
                          <th scope="col">Posted Date</th>
                          <th scope="col">Expired</th>
                          <th scope="col">Applications</th>
                          <th scope="col">Action</th>
                        </tr>
                                          </thead>
                                           
                      <tbody>
                        {list.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <div className="dash-title">
                                <h4 className="mb-0 ft-medium fs-sm">
                                  {item.nameJob ?? ""}
                                  {item.status ? (
                                    <span className="medium theme-cl rounded text-success bg-light-success ml-1 py-1 px-2">
                                      Pending
                                    </span>
                                  ) : (
                                    <span className="medium theme-cl rounded text-error bg-light-error ml-1 py-1 px-2">
                                      Close
                                    </span>
                                  )}
                                </h4>
                              </div>
                            </td>
                            <td>
                              <div className="dash-filled">
                                <span className="p-2 circle gray d-inline-flex align-items-center justify-content-center">
                                  <i className="lni lni-minus" />
                                </span>
                              </div>
                            </td>
                            <td>{customDate(item.createdAt ?? "")}</td>
                            <td>{customDate(item.timeWork ?? "")}</td>
                            <td>
                              {item.proposal ? (
                                <Link
                                  to={`/person-apply/${item._id}`}
                                  href="dashboard-manage-applications.html"
                                  className="theme-bg text-light rounded px-3 py-2 ft-medium"
                                >
                                  Total {item.proposal.length}
                                </Link>
                              ) : (
                                <Link
                                  href="dashboard-manage-applications.html"
                                  className="gray rounded px-3 py-2 ft-medium"
                                >
                                  ----
                                </Link>
                              )}
                            </td>
                            <td>
                              <div className="dash-action">
                                <a
                                  href="javascript:void(0);"
                                  className="p-2 circle text-info bg-light-info d-inline-flex align-items-center justify-content-center mr-1"
                                >
                                  <i className="lni lni-eye" />
                                </a>
                                <Link to={`/update-job/${item._id}`}
                                  href="javascript:void(0);"
                                  className="p-2 circle text-success bg-light-success d-inline-flex align-items-center justify-content-center"
                                >
                                  <i className="lni lni-pencil" />
                                        </Link>
                                        <Popconfirm
                                            title="Delete the job"
                                            description="Are you sure to delete this job?"
                                            onConfirm={()=>confirm(item._id)}
                                            onCancel={cancel}
                                            okText="Yes"
                                            className="my-popconfirm"
                                            cancelText="No"
                                        >
                                            <div
                                            className="p-2 circle text-danger bg-light-danger d-inline-flex align-items-center justify-content-center ml-1 cursor-pointer"
                                            >
                                            <i className="lni lni-trash-can" />
                                            </div>
                                        </Popconfirm>
                                
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                                      </table>
                                      <>
                          {loading && (
                            <div className="col-12 text-center">
                              <Spin />
                            </div>
                          )}
                        </>
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

export default ListJob;
