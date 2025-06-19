export const validateEmail = (mail: string) => {
  // eslint-disable-next-line no-useless-escape
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};
export const validateFullName = (value: string) => {
  const regex =
    /^[A-Za-zĐđÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ ]+$/u;
  return regex.test(value);
};
export const validateDob = (dob: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(dob);

export const isValidPassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^0\d{9}$/; // Số điện thoại Việt Nam (bắt đầu bằng 0, có 10 số)
  return phoneRegex.test(phone);
};
export const validateOTP = (otp: string) => {
  // Kiểm tra có đúng 6 chữ số không
  if (!/^\d{6}$/.test(otp)) return false;

  // Kiểm tra 6 số khác nhau
  const uniqueDigits = new Set(otp);
  if (uniqueDigits.size !== 6) return false;

  // Kiểm tra không có 3 số liên tiếp (tăng hoặc giảm)
  for (let i = 0; i < 4; i++) {
    const n1 = parseInt(otp[i], 10);
    const n2 = parseInt(otp[i + 1], 10);
    const n3 = parseInt(otp[i + 2], 10);

    if ((n1 + 1 === n2 && n2 + 1 === n3) || (n1 - 1 === n2 && n2 - 1 === n3)) {
      return false;
    }
  }

  return true;
};
