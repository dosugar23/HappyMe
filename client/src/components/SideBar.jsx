import { getDataLocalStorage } from "../utils/utils"
import { Link } from "react-router-dom";

const sideBarFreeLance = [
  {
    id: 1,
    title: 'My Profile',
    icon: <i className="lni lni-user mr-2" />,
    path: '/profile'
  },
  {
    id: 2,
    title: 'Change Password',
    icon: <i class="lni lni-lock-alt mr-2" />,
    path: '/change-password'
  }  ,
  {
    id: 3,
    title: 'Message',
    icon: <i className="lni lni-envelope mr-2"></i>,
    path: '/list-message'
  },
  {
    id: 4,
    title: 'History Draw',
    icon: <i className="lni lni-money-protection"></i>,
    path: '/list-history-draw'
  }
];

const sideBarCompany = [
  {
    id: 1,
    title: 'My Post',
    icon: <i className="lni lni-files mr-2" />,
    path: '/jobs'
  },
  {
    id: 2,
    title: 'My Profile',
    icon: <i className="lni lni-user mr-2" />,
    path: '/profile'
  }
  ,
  {
    id: 3,
    title: 'Message',
    icon: <i className="lni lni-envelope mr-2"></i>,
    path: '/list-message'
  },
  {
    id: 4,
    title: 'History Draw',
    icon: <i className="lni lni-money-protection"></i>,
    path: '/list-history-draw'
  }
]

const sideBarAdmin = [
  {
    id: 1,
    title: 'Management Post',
    icon: <i className="lni lni-files mr-2" />,
    path: '/list-post-management'
  },
  {
    id: 2,
    title: 'Management Users',
    icon: <i className="lni lni-user mr-2" />,
    path: '/list-users'
  },
  {
    id: 3,
    title: 'My Profile',
    icon: <i className="lni lni-user mr-2" />,
    path: '/profile'
  }
]

const SideBar = () => {
    const dataLocal = getDataLocalStorage('user:detail');
    const pathMain = window.location.pathname;

    return (
        <div>
        <div className="dashboard-nav">
          <div className="dashboard-inner">
            
                    <ul data-submenu-title="My Accounts">
                        {
                            dataLocal.role === 'freelance' && (
                                <>
                       

                                    {sideBarFreeLance.map((item) => (
                                        <li key={item.id} className={pathMain === item.path ? 'active' : ''}><Link to={item.path}>{item.icon}{item.title}</Link></li>
                                    ))}
                                </>
                            )
              }
              {
                dataLocal.role === 'company' && (
                  <>
                    {/* <li className="active"><a href="dashboard-my-profile.html"><i className="lni lni-user mr-2" />My Profile </a></li>
                      <li><a href="dashboard-change-password.html"><i className="lni lni-lock-alt mr-2" />Change Password</a></li>
                      <li><a href="javascript:void(0);"><i className="lni lni-trash-can mr-2" />Delete Account</a></li>
                      <li><a href="login.html"><i className="lni lni-power-switch mr-2" />Log Out</a></li> */}

                      {sideBarCompany.map((item) => (
                          <li key={item.id} className={pathMain === item.path ? 'active' : ''}><Link to={item.path}>{item.icon}{item.title}</Link></li>
                      ))}
                  </>
              )
              }

{
                dataLocal.role === 'admin' && (
                  <>
                      {sideBarAdmin.map((item) => (
                          <li key={item.id} className={pathMain === item.path ? 'active' : ''}><Link to={item.path}>{item.icon}{item.title}</Link></li>
                      ))}
                  </>
              )
              }
            </ul>
          </div>					
        </div>
      </div>
    )
}

export default SideBar