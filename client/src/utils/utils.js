
export const URL = 'http://localhost:8000';
  
export const imageUpload = async (file) => {
      const formData = new FormData();
  
        formData.append("file", file);
  
      formData.append("upload_preset", "ncpanat5");
      formData.append("cloud_name", "khanhbatluc");
  
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/khanhbatluc/upload",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await res.json();
    return data;
};
  
export const pdfUpload = async (file) => {
  const formData = new FormData();

    formData.append("file", file);

  formData.append("upload_preset", "ncpanat5");
  formData.append("cloud_name", "khanhbatluc");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/khanhbatluc/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
return data;
};
  

export const getDataLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name))
}

export const customDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('vi-VN', options).replace(/,/g, '');
  return formattedDate;
}

export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? '1d ago' : `${days}d ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1h ago' : `${hours}h ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1mins ago' : `${minutes}mins ago`;
  } else {
    return 'Just now';
  }
}

export const showTitle = (key) => {
  let text = '';

  switch (key) {
    case '1':
      text = 'Begginer';
      break;
      case '2':
        text = '0 To 6 Month';
      break;
      case '3':
        text = '1 Years';
      break;
      case '4':
        text = '2 Years';
      break;
      case '5':
        text = '3 Years';
      break;
      case '6':
        text = '5+ Years';
        break;
    default:
      break;
  }
  return text;
}