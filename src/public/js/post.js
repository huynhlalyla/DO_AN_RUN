$(document).ready(function() {
    // Thêm class 'has-child' cho li có sub-menu
    $('.sub-menu').parent('li').addClass('has-child');

    // Bật/tắt sidebar khi nhấp vào nút toggle
    $('#toggle-sidebar').on('click', function(e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định
        $('#overlay').toggleClass('visible'); // Chuyển đổi class 'visible' cho overlay
        $('#sidebar').toggleClass('visible'); // Chuyển đổi class 'visible' cho sidebar
    });

    // Tắt sidebar khi nhấp ra ngoài
    $('#overlay').click(function() {
        $(this).removeClass('visible'); // Ẩn overlay
        $('#sidebar').removeClass('visible'); // Ẩn sidebar
    });
    
    // Hiển thị hoặc ẩn các trường dữ liệu dựa trên loại môn học
    $('#subjectType').change(function () {
        const selectedType = $(this).val();

        if (selectedType === 'general') {
            $('#generalSubjectField').show(); // Hiện trường nhập môn đại cương
            $('#majorFields').hide(); // Ẩn trường nhập môn chuyên ngành
            $('#subjectNameMajor').val(''); // Xóa giá trị trong trường môn chuyên ngành
            $('#subjectName').val(''); // Xóa giá trị trong trường môn đại cương
            $('.suggestions').hide(); // Ẩn gợi ý môn chuyên ngành
        } else if (selectedType === 'major') {
            $('#generalSubjectField').hide(); // Ẩn trường nhập môn đại cương
            $('#majorFields').show(); // Hiện trường nhập môn chuyên ngành
            $('#subjectName').val(''); // Xóa giá trị trong trường môn đại cương
            $('.suggestions').hide(); // Ẩn gợi ý môn đại cương
        } else {
            $('#generalSubjectField').hide(); // Ẩn cả hai trường nếu không có lựa chọn
            $('#majorFields').hide();
        }
    });

    // Dữ liệu mẫu cho các ngành và môn học đã có
    const majors = ["Công nghệ thông tin", "Khoa học máy tính", "Kỹ thuật phần mềm"];
    const subjects = {
        general: ["Giải tích", "Toán rời rạc", "Triết học Mác-Lênin", "Tư tưởng Hồ Chí Minh"],
        major: {
            "Công nghệ thông tin": ["Lập trình web", "Cơ sở dữ liệu", "Lập trình hướng đối tượng", "Đồ họa máy tính"],
            "Khoa học máy tính": ["Lập trình máy tính", "Trí tuệ nhân tạo", "Tin học đám mây"],
            "Kỹ thuật phần mềm": ["Công nghệ .NET", "Giao diện người dùng", "Giao tiếp người máy"]
        }
    };

    // Gợi ý ngành
    $('#fieldName').on('input', function () {
        const input = $(this).val().toLowerCase();
        const suggestions = majors.filter(major => major.toLowerCase().includes(input));

        showSuggestions('#fieldNameSuggestions', suggestions);
    });

    // Gợi ý môn học cho môn đại cương
    $('#subjectName').on('input', function () {
        const input = $(this).val().toLowerCase();
        const suggestions = subjects.general.filter(subject => subject.toLowerCase().includes(input)); // Lấy gợi ý từ môn đại cương

        showSuggestions('#subjectNameSuggestions', suggestions); // Hiển thị gợi ý cho môn đại cương
    });

    // Gợi ý môn học cho ngành chuyên ngành
    $('#subjectNameMajor').on('input', function () {
        const input = $(this).val().toLowerCase();
        const selectedMajor = $('#fieldName').val(); // Lấy ngành đã chọn
        const suggestions = subjects.major[selectedMajor] ? subjects.major[selectedMajor].filter(subject => subject.toLowerCase().includes(input)) : []; // Lấy gợi ý từ môn chuyên ngành dựa trên ngành đã chọn

        showSuggestions('#subjectNameSuggestionsMajor', suggestions); // Hiển thị gợi ý cho môn chuyên ngành
    });

    // Hiển thị gợi ý
    function showSuggestions(selector, suggestions) {
        const suggestionBox = $(selector);
        suggestionBox.empty();
        if (suggestions.length) {
            suggestions.forEach(suggestion => {
                suggestionBox.append(`<li>${suggestion}</li>`);
            });
            suggestionBox.show();
        } else {
            suggestionBox.hide();
        }
    }

    // Chọn gợi ý từ danh sách
    $(document).on('click', '.suggestions li', function () {
        const selectedValue = $(this).text();
        $(this).closest('ul').prev('input').val(selectedValue);
        $('.suggestions').hide();
    });

    // Ẩn gợi ý khi click ra ngoài
    $(document).click(function (event) {
        if (!$(event.target).closest('.post-input, .suggestions').length) {
            $('.suggestions').hide();
        }
    });

    // Ẩn gợi ý khi click vào ô nhập liệu khác
    $('.post-input').focus(function() {
        $('.suggestions').hide(); // Ẩn tất cả gợi ý khi nhấp vào ô nhập liệu khác
    });
});


document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect data from form fields
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const subjectType = document.getElementById('subjectType').value;
    const subjectName = subjectType === 'general'
        ? document.getElementById('subjectName').value
        : document.getElementById('subjectNameMajor').value;
    const fieldName = subjectType === 'major' ? document.getElementById('fieldName').value : '';

    // Convert each file to Base64 and save it to sessionStorage
    const files = Array.from(document.getElementById('fileUpload').files);
    const videoFiles = Array.from(document.getElementById('videoUpload').files);

    // Convert files and videos to Base64 strings
    async function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    const fileData = await Promise.all(files.map(async file => ({
        name: file.name,
        type: file.type,
        content: await toBase64(file)
    })));

    const videoData = await Promise.all(videoFiles.map(async video => ({
        type: video.type,
        content: await toBase64(video)
    })));

    // Save all data to sessionStorage
    sessionStorage.setItem('title', title);
    sessionStorage.setItem('content', content);
    sessionStorage.setItem('subjectType', subjectType);
    sessionStorage.setItem('subjectName', subjectName);
    sessionStorage.setItem('fieldName', fieldName);
    sessionStorage.setItem('fileData', JSON.stringify(fileData));
    sessionStorage.setItem('videoData', JSON.stringify(videoData));

    // Redirect to home.html
    window.location.href = 'home.hbs';
});

