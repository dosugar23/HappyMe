import { useState, useEffect } from "react";
import Button from "../../components/Button";
import InputC from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { Radio, Select } from "antd";

import { DatePicker, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import { URL, imageUpload } from "../../utils/utils";
import axios from "axios";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Form = ({ isSignInPage = true }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: "",
      address: "",
      phone: "",
      avatar:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      gender: "",
      birthday: "",
      skill: [],
      isWorker: false,
    }),
    email: "",
    password: "",
  });
  const [listCategory, setListCategory] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList: newFileList }) => {
    if (newFileList[0]?.originFileObj) {
      const uploadResult = await imageUpload(newFileList[0].originFileObj);

      console.log("====================================");
      console.log(uploadResult);
      console.log("====================================");

      setFileList([
        {
          uid: uploadResult.asset_id,
          name: uploadResult.original_filename,
          status: "done",
          url: uploadResult.url,
        },
      ]);
    } else {
      const newArray = newFileList.map((item) => ({
        ...item,
        status: "done",
      }));

      setFileList(newArray);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      address,
      avatar,
      birthday,
      email,
      fullName,
      gender,
      password,
      phone,
      skill,
    } = data;

    if (
      !isSignInPage && (
        !address ||
      !birthday ||
      !email ||
      !fullName ||
      !gender ||
      !password ||
      !phone ||
      skill.length <= 0
      )
    ) {
      message.error("Please enter the input");
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
          {
            ...data,
            avatar: fileList[0].url,
          }
        );

        if (res) {
          message.success("Success");
          resetData();
          navigate("/users/sign_in");
        }
        if (res.data.token) {
          localStorage.setItem("user:token", res.data.token);
          localStorage.setItem("user:detail", JSON.stringify(res.data.user));

          if (res.data.user.role === 'company') {
            navigate("/jobs", {replace:true});
          } else if (res.data.user.role === 'admin') {
            navigate("/list-post-management", {replace: true});
          }
          else {
            navigate("/", {replace: true});
          }
          navigate(0);
        }
      } catch (error) {
        console.log(error);
        message.error("Error Server");
      }
    }
  };

  const resetData = () => {
    setData({
      ...(!isSignInPage && {
        fullName: "",
        address: "",
        phone: "",
        avatar:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        gender: "",
        birthday: "",
        skill: [],
        isWorker: false,
      }),
      email: "",
      password: "",
    });


  };

  useEffect(() => {
    new Promise(async () => {
      await fetchingListCategory();
    });
  }, []);

  const fetchingListCategory = async () => {
    const res = await axios.get(`${URL}/api/get-all-categories`);
    if (res) {
      const data = res.data.all?.map((item) => ({
        label: item.nameCategory,
        value: item.nameCategory,
      }));
      setListCategory(data);
    }
  };

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setData({ ...data, isWorker: e.target.checked });
  };

  return (
    <div className=" flex items-center justify-center">
      <div
        className=" w-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center m-3"
       
      >
        <div className=" text-4xl font-extrabold">
          Welcome to {isSignInPage && "HappyMe"}
        </div>
        <div className=" text-xl font-light mb-14">
          {isSignInPage ? "Sign in to get explored" : "Sign up to get started"}
        </div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={(e) => handleSubmit(e)}
        >
          {!isSignInPage && (
            <div className="mb-6">
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </div>
          )}

          {!isSignInPage && (
            <InputC
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6 w-[75%]"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <InputC
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="mb-6 w-[75%]"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <InputC
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="mb-6 w-[75%]"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {!isSignInPage && (
            <InputC
              label="Address"
              name="address"
              placeholder="Enter your address"
              className="mb-6 w-[75%]"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          )}
          {!isSignInPage && (
            <InputC
              label="Phone"
              name="phone"
              type="number"
              placeholder="Enter your phone"
              className="mb-6 w-[75%]"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          )}

          {!isSignInPage && (
            <div className="mb-6 w-[75%]">
              <label htmlFor="block text-sm font-medium text-gray-800 pb-2">
                Birthday
              </label>
              <DatePicker
                className="block w-full p-1.5"
                onChange={(e, valueString) =>
                  setData({ ...data, birthday: valueString })
                }
              />
            </div>
          )}
          {!isSignInPage && (
            <div className="mb-6 w-[75%]">
              <label htmlFor="block text-sm font-medium text-gray-800 pb-2">
                Gender
              </label>
              <Radio.Group
                // className="block"
                // defaultValue={""}
                onChange={(e) => setData({ ...data, gender: e.target.value })}
              >
                <Radio value={"male"}>Male</Radio>
                <Radio value={"female"}>FeMale</Radio>
              </Radio.Group>
            </div>
          )}
          {!isSignInPage && (
            <div className="mb-6 w-[75%]">
              <label htmlFor="block text-sm font-medium text-gray-800 pb-2">
                Categories
              </label>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={(e) => setData({ ...data, skill: e })}
                options={listCategory}
              />
            </div>
          )}
          {!isSignInPage && (
            <div className="form-input-register mb-6 w-[75%]">
              <Checkbox style={{ fontSize: "20px" }} onChange={onChange} />
              <p>Click if you a Professional Therapist</p>
            </div>
          )}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
          <Button
            label={isSignInPage ? "Sign in" : "Sign up"}
            type="submit"
            className="w-[75%] mb-2 bg-color-custom"
          />
        </form>
        <div>
          {isSignInPage ? "Didn't have an account?" : "Alredy have an account?"}{" "}
          <span
            className=" cursor-pointer underline"
            onClick={() =>
              navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`)
            }
          >
            {isSignInPage ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
