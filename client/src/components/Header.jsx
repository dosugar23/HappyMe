import Logo from "../assets/img/logo.png"
import { Link } from "react-router-dom";
import { getDataLocalStorage } from "../utils/utils";

const Header = () => {

  const localData = getDataLocalStorage('user:detail');

    return (
        <div className="header header-transparent dark-text">
        <div className="container">
          <nav id="navigation" className="navigation navigation-landscape">
            <div className="nav-header">
              <a className="nav-brand" href="#">
                <img src={Logo} className="logo" alt="" href="/" />
              </a>
              <div className="nav-toggle" />
              <div className="mobile_nav">
                <ul>
                  <li>
                    <a href="#" data-toggle="modal" data-target="#login" className="theme-cl fs-lg">
                      <i className="lni lni-user" />
                    </a>
                  </li>
                  <li>
                    <a href="dashboard-post-job.html" className="crs_yuo12 w-auto text-white theme-bg">
                      <span className="embos_45"><i className="fas fa-plus-circle mr-1 mr-1" />Post Job</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="nav-menus-wrapper" style={{transitionProperty: 'none'}}>
              <ul className="nav-menu">
                <li><Link to={'/'}>Home</Link>
                </li>
                <li><Link to={'/find-job'}>Find Cases</Link>
                </li>
              </ul>
              
                {
                localData && (
                  <ul className="nav-menu nav-menu-social align-to-right">
                <li>
                  <Link to={`/profile`} className="ft-medium">
                    <i className="lni lni-user mr-2" />{localData.email}
                  </Link>
                </li>
                    {
                      localData.role === 'company' && (
                        <li className="add-listing theme-bg">
                        <Link to={'/create-job'}>
                          <i className="lni lni-circle-plus mr-1" /> Post a Case
                        </Link>
                      </li>
                      )
                   }
              </ul>
                  )
                }
            </div>
          </nav>
        </div>
      </div>
    )
}

export default Header;