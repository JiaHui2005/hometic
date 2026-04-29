import React, { useEffect } from "react";

const brand = {
  bg: "#f9f5ed",
  primary: "#234a4a",
  orange: "#da8f48",
  white: "#ffffff",
  text: "#1a1a1a",
  muted: "#71717a",
  border: "#e5e1d8"
};

const styles = {
  container: {
    backgroundColor: brand.bg,
    minHeight: '80vh',
    padding: '80px 10%',
    fontFamily: '"Outfit", "Inter", sans-serif',
    color: brand.text,
    lineHeight: '1.8'
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px'
  },
  title: {
    fontSize: '42px',
    fontWeight: '900',
    color: brand.text,
    marginBottom: '15px'
  },
  divider: {
    width: '80px',
    height: '4px',
    backgroundColor: brand.text,
    margin: '0 auto',
    borderRadius: '2px'
  },
  content: {
    backgroundColor: brand.white,
    padding: '50px',
    borderRadius: '30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
    border: `1px solid ${brand.border}`
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: brand.text,
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: brand.text,
    borderRadius: '50%'
  },
  text: {
    fontSize: '16px',
    color: brand.text,
    opacity: 0.9
  },
  list: {
    paddingLeft: '20px',
    marginTop: '15px'
  },
  listItem: {
    marginBottom: '10px'
  }
};

export default function StaticPages({ pageKey }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageKey]);

  const renderContent = () => {
    switch (pageKey) {
      case "about":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Câu chuyện Hometic & POPO Services</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Phần 1: Khởi nguồn */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Khởi nguồn từ khát vọng đổi mới
                </h2>
                <p style={styles.text}>
                  Ra đời từ năm 2024, <strong>Hometic</strong> không chỉ đơn thuần là một điểm đến bán lẻ các thiết bị gia dụng. Chúng tôi là tập hợp của những kỹ sư, những người đam mê công nghệ luôn trăn trở về việc làm thế nào để tối ưu hóa không gian sống. Trong kỷ nguyên số, chúng tôi tin rằng mỗi ngôi nhà đều xứng đáng trở thành một "trợ lý thông minh", giúp con người giải phóng khỏi những bộn bề thường nhật để tận hưởng trọn vẹn từng khoảnh khắc bên gia đình.
                </p>
              </div>

              {/* Phần 2: Sự hậu thuẫn từ POPO Services */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Sức mạnh vận hành bởi POPO Services
                </h2>
                <p style={styles.text}>
                  Một điểm khác biệt cốt lõi khiến Hometic tự tin dẫn đầu thị trường chính là sự hậu thuẫn vững chắc từ <strong>POPO Services</strong>. Với bề dày kinh nghiệm trong lĩnh vực cung ứng giải pháp hạ tầng và dịch vụ hậu cần chuyên nghiệp, POPO Services chính là "trái tim" vận hành toàn bộ hệ thống website và quy trình chăm sóc khách hàng của chúng tôi.
                </p>
                <p style={styles.text}>
                  Nhờ vào nền tảng công nghệ và quy chuẩn dịch vụ khắt khe của POPO Services, Hometic cam kết mỗi trải nghiệm mua sắm của bạn — từ lúc nhấn nút đặt hàng đến khi nhận thiết bị tận tay — đều diễn ra mượt mà, minh bạch và an toàn tuyệt đối.
                </p>
              </div>

              {/* Phần 3: Giá trị cốt lõi */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Giá trị nghệ thuật trong công nghệ
                </h2>
                <p style={styles.text}>
                  Tại Hometic, chúng tôi không chọn sản phẩm theo số lượng, chúng tôi chọn theo tiêu chuẩn. Mỗi thiết bị có mặt trên hệ thống đều phải trải qua quy trình kiểm định "kép" từ đội ngũ chuyên gia của Hometic và các tiêu chuẩn kỹ thuật từ POPO Services.
                </p>
                <p style={styles.text}>
                  Chúng tôi chú trọng vào những giải pháp mang tính bền vững: Tiết kiệm năng lượng, vật liệu thân thiện với môi trường và đặc biệt là thiết kế tinh tế. Đối với chúng tôi, một chiếc nồi chiên hay một bộ robot hút bụi không chỉ là công cụ, mà còn là một tác phẩm trang trí tôn lên vẻ đẹp hiện đại cho căn hộ của bạn.
                </p>
              </div>

              {/* Phần 4: Tầm nhìn tương lai */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Tầm nhìn 2030
                </h2>
                <p style={styles.text}>
                  Hướng tới tương lai, Hometic cùng POPO Services đang không ngừng nghiên cứu để tích hợp các giải pháp AI và IoT sâu hơn vào đời sống người Việt. Chúng tôi không dừng lại ở việc bán sản phẩm, chúng tôi cung cấp một hệ sinh thái sống thông minh, nơi mà công nghệ phục vụ con người một cách vô hình nhưng hiệu quả nhất.
                </p>
              </div>
            </div>
          </>
        );
      case "news":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Tin tức & Sự kiện nổi bật</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Sự kiện 1: Mega Live với PewPew */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div>
                  Mega Live: Hometic x PewPew - "Nấu ăn không khó, có Pew lo"
                </h2>
                <p style={styles.text}>
                  Một sự kiện bùng nổ không thể bỏ lỡ! Hometic chính thức xác nhận buổi Livestream đặc biệt cùng streamer <strong>PewPew</strong> vào cuối tuần này. Không chỉ là những màn review sản phẩm "thẳng và thật" đúng chất PewPew, anh chàng sẽ trực tiếp vào bếp thử thách độ bền và tính năng thông minh của dòng Smart Kitchen 2024 ngay trên sóng trực tiếp.
                </p>
                <p style={styles.text}>
                  Đặc biệt, trong phiên live này, <strong>POPO Services</strong> sẽ tung ra hệ thống mã giảm giá độc quyền và dịch vụ "Giao hàng siêu tốc 2h" chỉ dành riêng cho các đơn đặt hàng qua website. Hãy cùng chờ đón những màn tung hứng hài hước và săn ngay những Deal độc nhất vô nhị từ Hometic và PewPew nhé!
                </p>
                <small style={{ color: brand.muted, fontWeight: 'bold' }}>Dự kiến: 20:00 - 30/04/2026</small>
              </div>

              {/* Sự kiện 2: Khai trương chi nhánh flagship */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div>
                  Khai trương Flagship Store Quận 7 - Trải nghiệm công nghệ 4.0
                </h2>
                <p style={styles.text}>
                  Đánh dấu cột mốc chi nhánh thứ 10, showroom mới tại trung tâm Quận 7 không chỉ là nơi trưng bày mà còn là một "Smart Home thực tế ảo". Tại đây, khách hàng có thể trực tiếp điều khiển các thiết bị gia dụng bằng giọng nói và cảm biến thông qua hệ thống quản lý do <strong>POPO Services</strong> thiết lập.
                </p>
                <p style={styles.text}>
                  Trong tuần lễ khai trương, Hometic dành tặng 100 phần quà giới hạn cho những khách hàng đầu tiên và chương trình ưu đãi lên đến 50% cho toàn bộ dòng sản phẩm gia dụng cao cấp. Đội ngũ kỹ thuật của POPO Services cũng sẽ có mặt trực tiếp để tư vấn lắp đặt hệ sinh thái nhà thông minh miễn phí cho khách tham quan.
                </p>
                <small style={{ color: brand.muted }}>Cập nhật: 25/04/2026</small>
              </div>

              {/* Sự kiện 3: Nâng cấp dịch vụ hậu mãi */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div>
                  Hometic & POPO Services: Công bố chuẩn mực bảo hành mới
                </h2>
                <p style={styles.text}>
                  Nhằm nâng cao trải nghiệm khách hàng, Hometic cùng đối tác vận hành <strong>POPO Services</strong> chính thức ra mắt cổng bảo hành điện tử 24/7. Mọi vấn đề kỹ thuật của khách hàng sẽ được tiếp nhận và xử lý tự động qua hệ thống AI, đảm bảo thời gian phản hồi dưới 30 phút.
                </p>
                <p style={styles.text}>
                  "Chúng tôi không chỉ bán một món đồ điện tử, chúng tôi bán sự an tâm." - Đại diện POPO Services chia sẻ về dự án nâng cấp toàn diện hạ tầng chăm sóc khách hàng lần này.
                </p>
                <small style={{ color: brand.muted }}>Tin hệ thống: 18/04/2026</small>
              </div>
            </div>
          </>
        );
      case "faq":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Câu hỏi thường gặp (FAQ)</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Câu 1: Bảo hành */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Chính sách bảo hành tại Hometic diễn ra như thế nào?</h2>
                <p style={styles.text}>
                  A: Toàn bộ sản phẩm do Hometic cung cấp đều được bảo hành chính hãng từ 12-24 tháng. Đặc biệt, nhờ sự phối hợp với <strong>POPO Services</strong>, khách hàng tại khu vực nội thành sẽ được hỗ trợ bảo hành tại nhà, giúp tiết kiệm thời gian vận chuyển thiết bị cồng kềnh.
                </p>
              </div>

              {/* Câu 2: Đổi trả */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Tôi có thể đổi trả hàng nếu không ưng ý hoặc sản phẩm bị lỗi?</h2>
                <p style={styles.text}>
                  A: Hometic cam kết chính sách 1 đổi 1 trong vòng 7 ngày đầu tiên nếu sản phẩm có lỗi kỹ thuật từ nhà sản xuất. Với các trường hợp đổi trả do thay đổi nhu cầu, sản phẩm cần được giữ nguyên seal, chưa qua sử dụng và đầy đủ phụ kiện đi kèm.
                </p>
              </div>

              {/* Câu 3: POPO Services vận chuyển */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Thời gian giao hàng trung bình là bao lâu?</h2>
                <p style={styles.text}>
                  A: Với hạ tầng logistics hiện đại từ <strong>POPO Services</strong>, các đơn hàng nội thành TP.HCM và Hà Nội sẽ được giao hỏa tốc trong 2h-4h. Đối với các tỉnh thành khác, thời gian nhận hàng dự kiến từ 2-3 ngày làm việc.
                </p>
              </div>

              {/* Câu 4: Livestream PewPew */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Tôi mua hàng trên Livestream của PewPew thì nhận ưu đãi ở đâu?</h2>
                <p style={styles.text}>
                  A: Các mã giảm giá (voucher) trong phiên live của <strong>PewPew</strong> sẽ được áp dụng trực tiếp tại giỏ hàng trên website Hometic. Bạn chỉ cần nhập đúng mã code được PewPew công bố để nhận giá ưu đãi "độc quyền" và các phần quà tặng kèm theo.
                </p>
              </div>

              {/* Câu 5: Lắp đặt */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Hometic có hỗ trợ lắp đặt thiết bị nhà thông minh (Smart Home) không?</h2>
                <p style={styles.text}>
                  A: Chắc chắn rồi! Đội ngũ kỹ thuật viên chuyên nghiệp từ <strong>POPO Services</strong> sẽ phụ trách khảo sát và lắp đặt tận nơi cho các gói sản phẩm Smart Home. Chúng tôi cũng sẽ hướng dẫn bạn cách kết nối và điều khiển thiết bị qua điện thoại một cách chi tiết nhất.
                </p>
              </div>

              {/* Câu 6: Thanh toán */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Tôi có thể thanh toán bằng những hình thức nào?</h2>
                <p style={styles.text}>
                  A: Hometic hỗ trợ đa dạng hình thức: Tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay) và đặc biệt là chương trình trả góp 0% lãi suất qua thẻ tín dụng để bạn dễ dàng sở hữu các thiết bị cao cấp.
                </p>
              </div>

              {/* Câu 7: Nguồn gốc sản phẩm */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Làm sao tôi biết sản phẩm của Hometic là hàng chính hãng?</h2>
                <p style={styles.text}>
                  A: Mỗi sản phẩm bán ra đều đi kèm hóa đơn VAT và tem chống hàng giả từ <strong>POPO Services</strong>. Bạn có thể quét mã QR trên tem bảo hành để kiểm tra thông tin kích hoạt và nguồn gốc xuất xứ của sản phẩm ngay trên hệ thống của chúng tôi.
                </p>
              </div>

              {/* Câu 8: Hỗ trợ kỹ thuật */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Q: Nếu gặp sự cố trong quá trình sử dụng, tôi liên hệ ai?</h2>
                <p style={styles.text}>
                  A: Bạn có thể gọi trực tiếp vào hotline hỗ trợ kỹ thuật 24/7 của <strong>POPO Services</strong> hoặc nhắn tin qua khung chat trực tuyến trên website. Đội ngũ tư vấn viên luôn sẵn sàng giải đáp và xử lý các vấn đề của bạn trong thời gian sớm nhất.
                </p>
              </div>
            </div>
          </>
        );
      case "returns":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Chính sách Đổi trả & Hoàn tiền</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Phần 1: Điều kiện chung */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 1. Điều kiện áp dụng đổi trả
                </h2>
                <p style={styles.text}>
                  Hometic luôn mong muốn khách hàng có trải nghiệm hài lòng nhất. Chính sách đổi trả được vận hành nghiêm ngặt bởi <strong>POPO Services</strong> nhằm đảm bảo quyền lợi tối đa cho bạn:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>Sản phẩm còn đầy đủ tem niêm phong, nhãn mác, hộp đựng nguyên vẹn và các phụ kiện đi kèm (phiếu bảo hành, sách hướng dẫn, quà tặng nếu có).</li>
                  <li style={styles.listItem}>Sản phẩm phát hiện lỗi kỹ thuật từ nhà sản xuất hoặc bị hư hại trong quá trình vận chuyển do POPO Services thực hiện.</li>
                  <li style={styles.listItem}>Sản phẩm chưa qua sử dụng, chưa kích hoạt bảo hành điện tử (đối với các dòng máy có số Serial/IMEI).</li>
                  <li style={styles.listItem}>Đối với hàng mua trong các phiên <strong>Mega Live của PewPew</strong>: Phải có video quay lại quá trình mở hộp (unboxing) để làm bằng chứng xác thực.</li>
                </ul>
              </div>

              {/* Phần 2: Thời gian quy định */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 2. Thời hạn xử lý
                </h2>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Đổi mới (1 đổi 1):</strong> Áp dụng trong vòng 7 ngày đầu tiên kể từ ngày nhận hàng thành công.</li>
                  <li style={styles.listItem}><strong>Trả hàng hoàn tiền:</strong> Áp dụng trong vòng 3 ngày nếu sản phẩm giao không đúng mô tả trên website hoặc nhầm lẫn mẫu mã.</li>
                  <li style={styles.listItem}><strong>Kiểm định lỗi:</strong> Đội ngũ kỹ thuật của POPO Services sẽ phản hồi kết quả kiểm định trong vòng 24h làm việc kể từ khi nhận lại hàng.</li>
                </ul>
              </div>

              {/* Phần 3: Các trường hợp từ chối */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 3. Các trường hợp không hỗ trợ đổi trả
                </h2>
                <p style={styles.text}>Chúng tôi rất tiếc phải từ chối hỗ trợ đổi trả đối với các trường hợp sau:</p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>Sản phẩm bị trầy xước, móp méo hoặc hư hại do tác động ngoại lực từ phía khách hàng hoặc bảo quản không đúng cách.</li>
                  <li style={styles.listItem}>Sản phẩm đã bị can thiệp vào linh kiện bên trong hoặc tự ý mang đi sửa chữa tại các cơ sở không thuộc ủy quyền của <strong>POPO Services</strong>.</li>
                  <li style={styles.listItem}>Các sản phẩm nằm trong danh mục "Xả hàng cuối năm" hoặc "Flash Sale" có ghi chú không đổi trả.</li>
                </ul>
              </div>

              {/* Phần 4: Quy trình thực hiện */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 4. Quy trình đổi trả đơn giản
                </h2>
                <p style={styles.text}>Để quá trình đổi trả diễn ra nhanh chóng, quý khách vui lòng thực hiện theo các bước:</p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Bước 1:</strong> Liên hệ Hotline hỗ trợ khách hàng của POPO Services hoặc nhắn tin qua khung Chat trên web.</li>
                  <li style={styles.listItem}><strong>Bước 2:</strong> Cung cấp mã đơn hàng và video/hình ảnh tình trạng sản phẩm.</li>
                  <li style={styles.listItem}><strong>Bước 3:</strong> Nhân viên giao nhận của POPO Services sẽ đến tận nơi để thu hồi sản phẩm (đối với khu vực nội thành) hoàn toàn miễn phí.</li>
                  <li style={styles.listItem}><strong>Bước 4:</strong> Nhận sản phẩm thay thế hoặc nhận tiền hoàn trả qua tài khoản ngân hàng trong vòng 3-5 ngày làm việc.</li>
                </ul>
              </div>

              {/* Phần 5: Lời cam kết */}
              <div style={styles.section}>
                <p style={{ ...styles.text, fontStyle: 'italic', color: brand.text, marginTop: '20px' }}>
                  "Sự an tâm của khách hàng là ưu tiên hàng đầu của Hometic. Với sự hỗ trợ vận hành chuyên nghiệp từ <strong>POPO Services</strong> và sự đồng hành của anh <strong>PewPew</strong>, chúng tôi cam kết xử lý mọi khiếu nại một cách công bằng, minh bạch và nhanh chóng nhất."
                </p>
              </div>
            </div>
          </>
        );
      case "stores":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Hệ thống Showroom Toàn quốc</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Khu vực Miền Nam */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Khu vực TP. Hồ Chí Minh & Miền Nam
                </h2>
                <p style={styles.text}>
                  <strong>Showroom 01 (Flagship Store):</strong> Tầng 2, Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, Quận 1.
                  <br /><span style={{ fontSize: '13px', color: brand.muted }}>(Trung tâm trải nghiệm nhà thông minh tích hợp AI)</span>
                </p>
                <p style={styles.text}>
                  <strong>Showroom 02:</strong> 456 Nguyễn Thị Thập, Phường Tân Quy, Quận 7.
                </p>
                <p style={styles.text}>
                  <strong>Showroom 03:</strong> 789 Phan Văn Trị, Gò Vấp (Khu CityLand Park Hills).
                </p>
                <p style={styles.text}>
                  <strong>Hometic Experience Hub - Bình Dương:</strong> TTTM Aeon Mall Canary, Thuận An, Bình Dương.
                </p>
                <p style={{ ...styles.text, color: brand.primary, fontSize: '14px', fontWeight: 'bold' }}>
                  * Hệ thống kho vận & Hub bảo trì khu vực phía Nam được vận hành trực tiếp bởi <strong>POPO Services - Depot 1</strong>.
                </p>
              </div>

              {/* Khu vực Miền Bắc */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Khu vực Hà Nội & Miền Bắc
                </h2>
                <p style={styles.text}>
                  <strong>Showroom 04:</strong> 123 Phố Huế, Quận Hai Bà Trưng, Hà Nội.
                </p>
                <p style={styles.text}>
                  <strong>Showroom 05:</strong> TTTM Vincom Mega Mall Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội.
                </p>
                <p style={styles.text}>
                  <strong>Showroom 06:</strong> 15 Lạch Tray, Quận Ngô Quyền, TP. Hải Phòng.
                </p>
                <p style={{ ...styles.text, color: brand.primary, fontSize: '14px', fontWeight: 'bold' }}>
                  * Trung tâm điều phối kỹ thuật miền Bắc tọa lạc tại <strong>POPO Services - Depot 2</strong> (KCN Quang Minh).
                </p>
              </div>

              {/* Khu vực Miền Trung */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Khu vực Đà Nẵng & Miền Trung
                </h2>
                <p style={styles.text}>
                  <strong>Showroom 07:</strong> 250 Hùng Vương, Quận Thanh Khê, TP. Đà Nẵng.
                </p>
                <p style={styles.text}>
                  <strong>Showroom 08:</strong> 112 Trần Hưng Đạo, TP. Nha Trang, Khánh Hòa.
                </p>
              </div>

              {/* Ghi chú Livestream PewPew */}
              <div style={{ ...styles.section, backgroundColor: brand.panel, padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
                <h2 style={{ ...styles.sectionTitle, color: brand.sidebar }}>
                  📢 Thông báo từ PewPew & POPO Services
                </h2>
                <p style={styles.text}>
                  Nhằm hỗ trợ tốt nhất cho các bạn săn Deal trong <strong>Mega Live của anh PewPew</strong>, Hometic đã mở rộng các điểm "Pickup Station" tại tất cả Showroom nêu trên. Bạn có thể chọn hình thức mua online trên Web và đến trực tiếp Showroom gần nhất để đội ngũ <strong>POPO Services</strong> hỗ trợ lắp đặt và hướng dẫn sử dụng ngay tại chỗ.
                </p>
              </div>
            </div>
          </>
        );
      case "guide":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Hướng dẫn Mua hàng & Săn Deal</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Phần 1: Mua hàng tại Website */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Quy trình mua hàng trực tuyến chuẩn 5 sao
                </h2>
                <p style={styles.text}>
                  Chỉ với vài thao tác đơn giản, hệ thống vận hành tự động của <strong>POPO Services</strong> sẽ đưa sản phẩm đến tận cửa nhà bạn:
                </p>
                <ol style={styles.list}>
                  <li style={styles.listItem}>
                    <strong>Tìm kiếm & Lựa chọn:</strong> Duyệt qua danh mục sản phẩm thông minh. Bạn có thể sử dụng bộ lọc theo thương hiệu, giá cả hoặc công nghệ tích hợp AI mới nhất.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Kiểm tra chi tiết:</strong> Nhấn vào sản phẩm để xem thông số kỹ thuật, video review thực tế và các đánh giá từ khách hàng đã sử dụng.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Giỏ hàng & Ưu đãi:</strong> Nhấn "Thêm vào giỏ hàng". Tại đây, đừng quên nhập các mã giảm giá độc quyền từ hệ thống hoặc mã <strong>"PEWPEW"</strong> nếu bạn đang xem livestream.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Thông tin giao hàng:</strong> Điền chính xác địa chỉ và số điện thoại. Hệ thống của <strong>POPO Services</strong> sẽ tự động tính toán phí vận chuyển và thời gian giao hàng dự kiến nhanh nhất.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Thanh toán an toàn:</strong> Lựa chọn phương thức thanh toán phù hợp (COD, Chuyển khoản, Ví điện tử hoặc Trả góp 0%). Hệ thống bảo mật SSL sẽ bảo vệ tuyệt đối thông tin của bạn.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Xác nhận & Theo dõi:</strong> Sau khi đặt hàng thành công, bạn sẽ nhận được SMS/Email xác nhận kèm mã vận đơn để theo dõi hành trình đơn hàng trực tiếp trên website.
                  </li>
                </ol>
              </div>

              {/* Phần 2: Đặc quyền khi mua qua Livestream */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> Mẹo săn Deal cực cháy cùng PewPew
                </h2>
                <p style={styles.text}>
                  Để không bỏ lỡ các siêu phẩm giá hời trong các phiên <strong>Mega Live</strong>, bạn nên thực hiện các bước sau:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>Đăng ký tài khoản Hometic và cập nhật địa chỉ giao hàng trước giờ livestream 30 phút.</li>
                  <li style={styles.listItem}>Nạp sẵn tiền vào ví điện tử hoặc chuẩn bị thẻ thanh toán để "chốt đơn" ngay khi anh PewPew tung mã, vì số lượng thường rất giới hạn.</li>
                  <li style={styles.listItem}>Tất cả đơn hàng mua qua live đều được <strong>POPO Services</strong> ưu tiên xử lý đóng gói và giao hỏa tốc trong vòng 24h.</li>
                </ul>
              </div>

              {/* Phần 3: Hỗ trợ sau mua hàng */}
              <div style={{ ...styles.section, borderLeft: `4px solid ${brand.primary}`, paddingLeft: '20px' }}>
                <h2 style={styles.sectionTitle}>Hỗ trợ trực tiếp</h2>
                <p style={styles.text}>
                  Nếu gặp bất kỳ khó khăn nào trong quá trình đặt hàng, quý khách vui lòng liên hệ tổng đài <strong>POPO Services Support</strong> tại số 1900-XXXX để được nhân viên hướng dẫn thao tác trực tiếp trên màn hình.
                </p>
              </div>
            </div>
          </>
        );
      case "retail":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Chính sách Bán lẻ & Đặc quyền Khách hàng</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Phần 1: Cam kết về Giá */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 1. Chính sách Giá bán lẻ cạnh tranh
                </h2>
                <p style={styles.text}>
                  Hometic cam kết mang đến mức giá bán lẻ tối ưu nhất cho người tiêu dùng nhờ vào việc nhập khẩu trực tiếp và tối ưu hóa chi phí vận hành thông qua hệ thống <strong>POPO Services</strong>.
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Bình ổn giá:</strong> Cam kết không tăng giá bất thường trong các mùa cao điểm mua sắm.</li>
                  <li style={styles.listItem}><strong>Hoàn tiền chênh lệch:</strong> Trong vòng 48h sau khi mua, nếu bạn tìm thấy sản phẩm chính hãng cùng model có giá thấp hơn tại các hệ thống lớn khác, Hometic sẽ hoàn lại phần chênh lệch (áp dụng theo điều khoản chương trình).</li>
                </ul>
              </div>

              {/* Phần 2: Đặc quyền Livestream PewPew */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 2. Đặc quyền khi mua sắm qua Livestream
                </h2>
                <p style={styles.text}>
                  Sự kết hợp giữa Hometic và <strong>PewPew</strong> mang đến những "phiên chợ số" bùng nổ với các chính sách bán lẻ chỉ xuất hiện trên sóng trực tiếp:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Flash Sale độc quyền:</strong> Giảm giá trực tiếp lên đến 45% cho các dòng robot hút bụi, máy lọc không khí và đồ gia dụng thông minh.</li>
                  <li style={styles.listItem}><strong>Combo PewPew:</strong> Các gói sản phẩm được anh PewPew trực tiếp lựa chọn và "mix" lại với giá bán lẻ thấp hơn 20% so với mua rời từng món.</li>
                </ul>
              </div>

              {/* Phần 3: Chương trình Khách hàng thân thiết */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 3. Hệ thống thành viên Hometic Member
                </h2>
                <p style={styles.text}>
                  Mỗi đơn hàng thành công trên website sẽ được hệ thống <strong>POPO Services</strong> tự động ghi nhận và tích lũy điểm thưởng:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Tích điểm không giới hạn:</strong> Mỗi 10.000 VNĐ chi tiêu tương đương 1 điểm thưởng. Điểm có thể dùng để trừ trực tiếp vào hóa đơn tiếp theo hoặc đổi quà tặng giá trị.</li>
                  <li style={styles.listItem}><strong>Hạng thẻ VIP:</strong> Khách hàng đạt hạng Vàng và Kim cương sẽ được miễn phí vận chuyển trọn đời và ưu tiên trải nghiệm các sản phẩm mới của Hometic trước khi mở bán chính thức.</li>
                </ul>
              </div>

              {/* Phần 4: Dịch vụ hậu cần POPO Services */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 4. Dịch vụ bán lẻ đi kèm
                </h2>
                <p style={styles.text}>
                  Chúng tôi không chỉ bán sản phẩm, chúng tôi bán sự hài lòng thông qua quy chuẩn dịch vụ từ <strong>POPO Services</strong>:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>Hỗ trợ cài đặt phần mềm và kết nối hệ sinh thái nhà thông minh hoàn toàn miễn phí tại showroom.</li>
                  <li style={styles.listItem}>Dịch vụ đóng gói quà tặng cao cấp cho các đơn hàng làm quà biếu, tân gia.</li>
                  <li style={styles.listItem}>Kiểm tra sản phẩm kỹ lưỡng (QC) bởi nhân viên POPO trước khi sản phẩm rời kho đến tay khách hàng.</li>
                </ul>
              </div>

              {/* Phần 5: Cam kết chất lượng */}
              <div style={{ ...styles.section, textAlign: 'center', backgroundColor: brand.panel, padding: '30px', borderRadius: '20px' }}>
                <p style={{ ...styles.text, fontWeight: 'bold', color: brand.sidebar }}>
                  "Tại Hometic, bán lẻ không chỉ là trao đi một thiết bị, mà là bắt đầu một mối quan hệ đồng hành lâu dài. Với sự chuyên nghiệp của POPO Services và sự tận tâm từ đội ngũ PewPew, chúng tôi tự tin mang đến chuẩn mực bán lẻ mới cho người Việt."
                </p>
              </div>
            </div>
          </>
        );
      case "delivery":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Vận chuyển & Lắp đặt Chuyên nghiệp</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Phần 1: Tốc độ giao hàng */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 1. Tốc độ giao hàng "Thần tốc"
                </h2>
                <p style={styles.text}>
                  Được vận hành bởi hệ thống kho bãi thông minh và đội ngũ shipper hùng hậu của <strong>POPO Services</strong>, Hometic tự hào có quy trình giao nhận dẫn đầu thị trường:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>
                    <strong>Dịch vụ Hometic Now:</strong> Giao hàng hỏa tốc trong vòng <strong>60 - 120 phút</strong> tại khu vực nội thành TP.HCM và Hà Nội.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Ưu tiên Livestream:</strong> Toàn bộ đơn hàng săn được trong phiên live của <strong>anh PewPew</strong> sẽ được POPO Services dán nhãn "Priority" để xử lý xuất kho ngay trong đêm.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Vận chuyển Toàn quốc:</strong> Chỉ từ 2-4 ngày làm việc đối với các tỉnh thành khác. Hệ thống quản lý vận đơn thời gian thực giúp bạn theo dõi từng bước di chuyển của sản phẩm.
                  </li>
                </ul>
              </div>

              {/* Phần 2: Quy chuẩn lắp đặt */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 2. Dịch vụ Lắp đặt "Trắng tay"
                </h2>
                <p style={styles.text}>
                  Bạn chỉ cần đặt hàng, việc còn lại đã có đội ngũ kỹ thuật viên lành nghề của <strong>POPO Services</strong> lo liệu:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>
                    <strong>Miễn phí 100%:</strong> Áp dụng công lắp đặt cho các thiết bị lớn như máy rửa bát, lò nướng âm tủ, hệ thống lọc nước và máy giặt thông minh.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Quy trình 5S:</strong> Kỹ thuật viên sẽ tiến hành khảo sát vị trí, lắp đặt đúng chuẩn kỹ thuật, kiểm tra vận hành và đặc biệt là vệ sinh sạch sẽ khu vực làm việc trước khi bàn giao.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Cài đặt Smart-Home:</strong> Hỗ trợ kết nối các thiết bị với ứng dụng quản lý trên điện thoại, thiết lập kịch bản tự động hóa (automation) theo nhu cầu riêng của gia đình.
                  </li>
                </ul>
              </div>

              {/* Phần 3: Phí vận chuyển & Bảo hiểm */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 3. Bảo hiểm hàng hóa & Chi phí
                </h2>
                <p style={styles.text}>
                  An toàn của sản phẩm là trách nhiệm cao nhất của chúng tôi:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}>
                    <strong>Bảo hiểm 100%:</strong> Mọi đơn hàng do POPO Services vận chuyển đều được bảo hiểm giá trị. Nếu xảy ra trầy xước hoặc hư hỏng dù là nhỏ nhất, Hometic sẽ đổi mới ngay lập tức.
                  </li>
                  <li style={styles.listItem}>
                    <strong>Free Ship:</strong> Miễn phí giao hàng cho tất cả đơn hàng từ 2.000.000 VNĐ trở lên hoặc khách hàng sử dụng mã voucher từ <strong>PewPew</strong>.
                  </li>
                </ul>
              </div>

              {/* Phần 4: Lời kết */}
              <div style={{ ...styles.section, backgroundColor: brand.panel, padding: '25px', borderRadius: '20px', border: `1px dashed ${brand.primary}` }}>
                <p style={{ ...styles.text, marginBottom: 0, fontWeight: 'bold', textAlign: 'center' }}>
                  "Sự hài lòng của khách hàng không kết thúc khi đơn hàng được thanh toán, nó chỉ thực sự bắt đầu khi thiết bị hoạt động hoàn hảo trong ngôi nhà của bạn. Với sự đồng hành của POPO Services, Hometic cam kết một dịch vụ hậu cần không tì vết."
                </p>
              </div>
            </div>
          </>
        );
      case "warranty":
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Trung tâm Bảo hành & Chăm sóc Khách hàng</h1>
              <div style={styles.divider}></div>
            </div>
            <div style={styles.content}>
              {/* Phần 1: Thông tin liên hệ đa kênh */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 1. Tiếp nhận bảo hành 24/7
                </h2>
                <p style={styles.text}>
                  Hometic hiểu rằng sự cố thiết bị có thể gây gián đoạn sinh hoạt của gia đình bạn. Vì vậy, hệ thống tiếp nhận bảo hành được vận hành bởi <strong>POPO Services</strong> luôn sẵn sàng hỗ trợ qua các kênh:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Hotline kỹ thuật:</strong> 1900 2555 79 (Hỗ trợ khẩn cấp từ 8:00 - 22:00 hàng ngày).</li>
                  <li style={styles.listItem}><strong>Bảo hành điện tử:</strong> Kích hoạt và tra cứu thời hạn bảo hành ngay trên Website hoặc qua mã QR dán trên thân máy.</li>
                  <li style={styles.listItem}><strong>Cổng hỗ trợ POPO:</strong> Gửi yêu cầu sửa chữa trực tuyến để kỹ thuật viên phản hồi trong vòng 30 phút.</li>
                </ul>
              </div>

              {/* Phần 2: Đặc quyền bảo hành tận nhà */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 2. Chính sách "Bảo hành tại gia"
                </h2>
                <p style={styles.text}>
                  Đừng lo lắng về việc phải tháo dỡ hay vận chuyển thiết bị cồng kềnh. Đối với các dòng sản phẩm Smart Kitchen và gia dụng lớn, <strong>POPO Services</strong> cung cấp đặc quyền:
                </p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Kỹ thuật viên lưu động:</strong> Có mặt tại nhà bạn trong vòng 24h làm việc đối với khu vực nội thành.</li>
                  <li style={styles.listItem}><strong>Cho mượn thiết bị thay thế:</strong> Đối với các ca sửa chữa kéo dài hơn 48h, Hometic sẽ cung cấp thiết bị tạm thời để không làm gián đoạn việc nấu nướng hay sinh hoạt của gia đình.</li>
                  <li style={styles.listItem}><strong>Đặc quyền PewPew Member:</strong> Khách hàng mua hàng trong các phiên Livestream của <strong>anh PewPew</strong> được tặng thêm gói "Bảo trì định kỳ 6 tháng/lần" hoàn toàn miễn phí.</li>
                </ul>
              </div>

              {/* Phần 3: Hệ thống trung tâm bảo trì */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <div style={styles.dot}></div> 3. Danh sách trung tâm bảo trì ủy quyền
                </h2>
                <p style={styles.text}>Quý khách có thể mang sản phẩm trực tiếp đến các trạm kỹ thuật của POPO Services:</p>
                <ul style={styles.list}>
                  <li style={styles.listItem}><strong>Miền Nam:</strong> 24C Phan Đăng Lưu, Quận Phú Nhuận, TP.HCM (Trung tâm điều hành chính).</li>
                  <li style={styles.listItem}><strong>Miền Bắc:</strong> Lô CN5, KCN Từ Liêm, Quận Bắc Từ Liêm, Hà Nội.</li>
                  <li style={styles.listItem}><strong>Miền Trung:</strong> 150 Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng.</li>
                </ul>
              </div>

              {/* Phần 4: Cam kết từ Hometic & POPO Services */}
              <div style={{
                ...styles.section,
                backgroundColor: brand.panel,
                padding: '25px',
                borderRadius: '20px',
                borderLeft: `5px solid ${brand.primary}`
              }}>
                <h2 style={{ ...styles.sectionTitle, color: brand.sidebar }}>Lợi ích tối thượng cho khách hàng</h2>
                <p style={styles.text}>
                  "Chúng tôi không chỉ bán sản phẩm, chúng tôi bán giải pháp và sự đồng hành. Với đội ngũ kỹ thuật viên được đào tạo khắt khe theo tiêu chuẩn của <strong>POPO Services</strong>, mỗi sản phẩm lỗi sẽ được hồi sinh với chất lượng như mới. Chúng tôi cam kết sử dụng 100% linh kiện chính hãng."
                </p>
                <p style={{ ...styles.text, fontWeight: 'bold', fontStyle: 'italic', textAlign: 'right' }}>
                  — Ban điều hành Hometic & Đối tác chiến lược POPO Services
                </p>
              </div>
            </div>
          </>
        );
      default:
        return <div>Trang không tồn tại</div>;
    }
  };

  return (
    <div style={styles.container}>
      {renderContent()}
    </div>
  );
}
