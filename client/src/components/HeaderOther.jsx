import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../utils/utils";
import { getDataLocalStorage } from "../utils/utils";

const HeaderOther = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState("");
    const handleLogout = () => {
        localStorage.removeItem('user:detail');
        localStorage.removeItem('user:token');
        navigate(0);
  }
  

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
    try {
      const res = await axios.get(`${URL}/api/get-user/${id}`);
        if (res) {
            setProfile(res.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  


    return (
        <div className="header header-light dark-text head-shadow" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
        <div className="container">
          <nav id="navigation" className="navigation navigation-landscape">
            <div className="nav-header">
              <a className="nav-brand" href="#">
                <img src="src\assets\favicon.ico" className="logo" href="/"/>
              </a>
              <div className="nav-toggle" />
              <div className="mobile_nav">
                <ul>
                  <li>
                    <a href="javascript:void(0);" data-toggle="modal" data-target="#login" className="crs_yuo12 w-auto text-dark gray">
                      <span className="embos_45"><i className="lni lni-power-switch mr-1 mr-1" />Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="nav-menus-wrapper" style={{transitionProperty: 'none'}}>
              {
                profile.role !== 'admin' && (
                  <ul className="nav-menu">
                <li><Link to={'/'}>Home</Link>
                 
                </li>
                <li><Link to={'/'}>Find Cases</Link>
                 
                 </li>
              </ul>
                )
              }
              <ul className="nav-menu nav-menu-social align-to-right">
              <li className="add-listing gray">
                  <Link>
                    {
                     `${ profile.money ? profile.money : 0 } $`
              }
                  </Link>
                </li>
                <li className="add-listing gray">
                  <Link onClick={handleLogout}>
                    <i className="lni lni-power-switch mr-1" /> Log out
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    )
}

export default HeaderOther