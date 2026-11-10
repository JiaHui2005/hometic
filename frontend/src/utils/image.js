// Ảnh Cloudinary: xin đúng bề ngang cần hiển thị (đã nhân 2 cho màn hình nét), tự chọn WebP/AVIF và mức nén.
// width bỏ trống thì chỉ tối ưu định dạng. Ảnh đã có tham số biến đổi thì giữ nguyên.
export const CLOUDINARY_UPLOAD = "res.cloudinary.com/";
export const withCloudinaryTransform = (url, width) => {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  const next = url.slice(i + marker.length);
  if (i < 0 || !/^(v\d+\/|[^,/]*\/)/.test(next) || /^[a-z]{1,3}_/.test(next)) return url;
  const t = ["f_auto", "q_auto", width && `c_limit,w_${width}`].filter(Boolean).join(",");
  return `${url.slice(0, i + marker.length)}${t}/${next}`;
};
