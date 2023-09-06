import HeaderOther from "../components/HeaderOther";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDataLocalStorage, URL, customDate } from "../utils/utils";
import axios from "axios";
import { Spin, message, Popconfirm  } from "antd";

const ListHistoryDraw = () => {
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
      const res = await axios.get(`${URL}/api/get-list-history/${id}`);
      if (res) {
        setLoading(false);
        setList(res.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    };

    console.log('====================================');
    console.log(list);
    console.log('====================================');
    

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
                <h1 className="ft-medium">History Draw</h1>
               
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
                      History Draw
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
                          <th scope="col">Email</th>
                          <th scope="col">Date</th>
                          <th scope="col">Money</th>
                          <th scope="col">STK</th>
                          <th scope="col">Bank</th>
                          <th scope="col">Status</th>
                        </tr>
                                          </thead>
                                           
                      <tbody>
                        {list?.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <div className="dash-title">
                                <h4 className="mb-0 ft-medium fs-sm">
                                  {item.name ?? ""}
                                </h4>
                              </div>
                            </td>
                            
                            <td>{customDate(Date.now(item.date) ?? "")}</td>
                            <td>{item.money} $</td>
                            <td>{item.account}</td>
                                <td>{item.bank}</td>
                                <td>
                                <span className="medium theme-cl rounded text-success bg-light-success ml-1 py-1 px-2">
                                      Success
                                    </span>
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
              <div className="py-3">© 2023 HappyMe. Designd By Bao Nguyen.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListHistoryDraw;
