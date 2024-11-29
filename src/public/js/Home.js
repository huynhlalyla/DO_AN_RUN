$(document).ready(function () {
    // Thêm class 'has-child' cho li có sub-menu
    $('.sub-menu').parent('li').addClass('has-child');

    // Bật/tắt sidebar khi nhấp vào nút toggle
    $('#toggle-sidebar').on('click', function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định
        $('#overlay').toggleClass('visible');
        $('#sidebar').toggleClass('visible');
    });

    // Tắt sidebar khi nhấp ra ngoài
    $('#overlay').click(function () {
        $(this).removeClass('visible');
        $('#sidebar').removeClass('visible');
    });
        // Ẩn menu khi click bên ngoài
    document.addEventListener('click', function (event) {
        document.querySelectorAll('.delete-option').forEach(deleteOption => {
            if (!deleteOption.contains(event.target) && !deleteOption.previousElementSibling.contains(event.target)) {
                deleteOption.style.display = 'none';
            }
        });
    });

    // Xử lý bật/tắt hiển thị phần bình luận
    $(document).on('click', '.comment-button', function (e) {
        e.stopPropagation();
        const $commentsDiv = $(this).closest('.post').find('.comments');
        const isVisible = $commentsDiv.is(':visible');
        $commentsDiv.toggle(!isVisible);
    });


    // Gửi bình luận khi nhấn Enter
    $(document).on('keydown', '.comment-input', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitComment($(this).siblings('.submit-comment'));
        }
    });

        // Hiển thị hoặc ẩn tùy chọn
    $(document).on('click', '.options-button', function(event) {
        event.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài
        const $deleteOption = $(this).siblings('.delete-option');
        const isVisible = $deleteOption.is(':visible');
        $('.delete-option').hide(); // Ẩn tất cả các tùy chọn khác
        if (!isVisible) {
            $deleteOption.show(); // Hiển thị tùy chọn liên quan
        }
    });


    // Xử lý xóa bài viết và cập nhật phân trang
    $(document).on('click', '.delete-button', function () {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            const $post = $(this).closest('.post');
            $post.remove();
            updatePagination();
        }
    });

    // Phân trang
    const postsPerPage = 1;
    let currentPage = 1;

    // Cập nhật phân trang
    function updatePagination() {
        const $posts = $('.post');
        const totalPosts = $posts.length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        // Cập nhật các nút phân trang
        $('#pagination').empty();
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                $('#pagination').append(
                    `<button class="page-btn" data-page="${i}">${i}</button>`
                );
            }
            $('#pagination-container').show();
        } else {
            $('#pagination-container').hide();
        }

        // Hiển thị bài viết trong trang hiện tại
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        showPage(currentPage);
    }

    // Hiển thị bài viết trong trang hiện tại
    function showPage(page) {
        const $posts = $('.post');
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        $posts.hide().slice(start, end).show();
        currentPage = page;

        // Cập nhật trạng thái nút phân trang
        $('#prev-page').prop('disabled', currentPage === 1);
        $('#next-page').prop('disabled', currentPage === Math.ceil($posts.length / postsPerPage));
    }

    // Điều hướng giữa các trang
    $(document).on('click', '.page-btn', function () {
        const page = $(this).data('page');
        showPage(page);
    });

    $('#prev-page').click(function () {
        if (currentPage > 1) {
            showPage(--currentPage);
        }
    });

    $('#next-page').click(function () {
        const totalPages = Math.ceil($('.post').length / postsPerPage);
        if (currentPage < totalPages) {
            showPage(++currentPage);
        }
    });

    // Khởi tạo phân trang ban đầu
    updatePagination();
});


// Retrieve data from session storage
const title = sessionStorage.getItem('title');
const content = sessionStorage.getItem('content');
const subjectName = sessionStorage.getItem('subjectName');
const fieldName = sessionStorage.getItem('fieldName');
const fileData = JSON.parse(sessionStorage.getItem('fileData') || '[]');
const videoData = JSON.parse(sessionStorage.getItem('videoData') || '[]');

// Generate HTML for files and videos
const fileHTML = fileData.map(file => `
    <a href="${file.content}" download="${file.name}" class="file-download">
        ${file.name}
    </a>
`).join('');

const videoHTML = videoData.map(video => `
    <video controls width="100%">
        <source src="${video.content}" type="${video.type}">
        Your browser does not support the video tag.
    </video>
`).join('');

if (title && subjectName) {
    const postHTML = `
        <div class="post">
            <div class="post-options">
                <button class="options-button" title="Options">...</button>
                <div class="delete-option" style="display: none;">
                    <button class="delete-button">Xóa</button>
                </div>
            </div>
            <h2 class="post-title">${title}</h2>
            <p class="post-subject">Tên môn: ${subjectName}</p>
            ${fieldName ? `<p class="post-field">Ngành: ${fieldName}</p>` : ''}
            <p class="post-content">${content}</p>
            <div class="post-media">
                ${fileHTML}
                ${videoHTML}
            </div>
            <div class="post-actions">
                <button class="comment-button" title="Bình luận">
                    <i class="fa-solid fa-comment"></i>
                    <span class="comment-count">0</span>
                </button>
                <button class="share-button" title="Chia sẻ">
                    <i class="fa-solid fa-share"></i>
                </button>
            </div>
            <div class="comments">
                <div class="comment-list-container">
                    <div class="comment-list"></div>
                </div>
                <textarea class="comment-input" placeholder="Nhập bình luận..." rows="1" style="display: none;"></textarea>
                <button class="submit-comment" style="display: none;">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>`;

    // Thêm bài viết vào đầu của #post-container
    const postContainer = document.getElementById('post-container');
    postContainer.insertAdjacentHTML('afterbegin', postHTML);

    // Attach event listeners after post injection
    document.querySelector('.comment-button').addEventListener('click', function () {
        const commentInput = document.querySelector('.comment-input');
        const submitCommentButton = document.querySelector('.submit-comment');
        commentInput.style.display = commentInput.style.display === 'none' ? 'block' : 'none';
        submitCommentButton.style.display = submitCommentButton.style.display === 'none' ? 'inline-block' : 'none';
    });

    document.querySelector('.share-button').addEventListener('click', function () {
        alert("Post shared successfully!"); // Placeholder for actual share functionality
    });

    document.querySelector('.submit-comment').addEventListener('click', function () {
        const commentText = document.querySelector('.comment-input').value;
        if (commentText.trim() !== "") {
            const commentList = document.querySelector('.comment-list');
            const newComment = document.createElement('div');
            newComment.className = 'comment-item';
            newComment.innerText = commentText;
            commentList.appendChild(newComment);
            document.querySelector('.comment-input').value = '';
            const commentCount = document.querySelector('.comment-count');
            commentCount.innerText = parseInt(commentCount.innerText) + 1;
        }
    });

    // Fullscreen support for video
    document.querySelectorAll('.post-media video').forEach(video => {
        video.addEventListener('click', function () {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { // Safari support
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { // IE/Edge support
                video.msRequestFullscreen();
            }
        });
    });
}

// Ẩn bình luận khi nhấn ra ngoài phần bình luận và bài viết
$(document).click(function (e) {
    const target = $(e.target);

    // Nếu không nhấn vào các phần tử liên quan đến bình luận
    if (
        !target.closest('.post, .comments, .comment-button, .edit-comment, .delete-comment, .save-comment, .cancel-comment, .edit-comment-input').length
    ) {
        // Ẩn phần bình luận đang hiển thị
        $('.comment-list-container:visible').hide();
        $('.comment-input:visible').hide();
        $('.submit-comment:visible').hide();
    }
});

// Không ẩn phần bình luận khi xử lý lưu/hủy chỉnh sửa
$(document).on('click', '#post-container', function (e) {
    if (
        $(e.target).hasClass('save-comment') ||
        $(e.target).hasClass('cancel-comment') ||
        $(e.target).hasClass('delete-comment')
    ) {
        // Chỉ xử lý sự kiện tương ứng mà không ẩn các phần tử bình luận
        e.stopPropagation();
    }
});


// Toggling visibility of the comment input area
$(document).on('click', '.comment-button', function () {
    const $commentsDiv = $(this).closest('.post').find('.comments');
    const $commentInput = $commentsDiv.find('.comment-input');
    const $submitButton = $commentsDiv.find('.submit-comment');
    const $commentListContainer = $commentsDiv.find('.comment-list-container');

    if ($commentInput.is(':visible')) {
        $commentInput.hide();
        $submitButton.hide();
    } else {
        $commentInput.show().focus();
        $submitButton.show();
        $commentListContainer.show();
    }
});


// Xử lý gửi bình luận khi nhấn nút submit
$(document).on('click', '#post-container', function(e) {
    if ($(e.target).hasClass('submit-comment')) {
        submitComment($(e.target));
    }
});

// Gửi bình luận khi nhấn Enter
$(document).on('keydown', '#post-container', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && $(e.target).hasClass('comment-input')) {
        e.preventDefault();
        submitComment($(e.target).siblings('.submit-comment'));
    }
});

// Cập nhật số lượng bình luận
function updateCommentCount(post) {
    const commentCount = post.find('.comment-item').length;
    post.find('.comment-count').text(commentCount);
}

// Hàm gửi bình luận
// Submit comment function
function submitComment(button) {
    const $commentInput = button.siblings('.comment-input');
    const commentText = $commentInput.val();
    const $commentList = button.closest('.comments').find('.comment-list');
    const $commentListContainer = button.closest('.comments').find('.comment-list-container');

    if (commentText) {
        const formattedComment = commentText.replace(/\n/g, '<br>');
        const commentHTML = `<div class="comment-item">
            <p>${formattedComment}</p>
            <div class="comment-actions">
                <button class="edit-comment">Chỉnh sửa</button>
                <button class="delete-comment">Xóa</button>
            </div>
        </div>`;

        $commentList.append(commentHTML);
        $commentInput.val(''); // Clear the input
        updateCommentCount(button.closest('.post'));
        $commentListContainer.scrollTop($commentListContainer[0].scrollHeight); // Scroll to the bottom
    }
}


// Kiểm tra và cập nhật viền cho danh sách bình luận
function toggleCommentListBorder($commentList) {
    const $commentListContainer = $commentList.closest('.comment-list-container');
    $commentListContainer.toggleClass('active', $commentList.children('.comment-item').length > 0);
}

// Xóa bình luận với xác nhận xóa
$(document).on('click', '#post-container', function(e) {
    if ($(e.target).hasClass('delete-comment')) {
        if (confirm('Bạn có chắc muốn xóa bình luận này không?')) {
            const $commentItem = $(e.target).closest('.comment-item');
            const $commentList = $commentItem.closest('.comment-list');
            const $post = $commentItem.closest('.post');
            $commentItem.remove();
            toggleCommentListBorder($commentList);
            updateCommentCount($post);
        }
    }
});

// Chỉnh sửa bình luận
$(document).on('click', '#post-container', function(e) {
    if ($(e.target).hasClass('edit-comment')) {
        const $commentItem = $(e.target).closest('.comment-item');
        const $commentText = $commentItem.find('p');
        const commentText = $commentText.html().replace(/<br>/g, '\n');
        $commentText.hide();
        $(e.target).siblings('.delete-comment').hide();
        $(e.target).hide();
        const $editTextarea = $('<textarea class="edit-comment-input" rows="1"></textarea>').val(commentText);
        const $saveButton = $('<button class="save-comment">Lưu</button>');
        const $cancelButton = $('<button class="cancel-comment">Hủy</button>');
        $commentItem.append($editTextarea, $saveButton, $cancelButton);
        $editTextarea.focus();
    }
});

// Lưu thay đổi sau khi chỉnh sửa bình luận
$(document).on('click', '#post-container', function(e) {
    if ($(e.target).hasClass('save-comment')) {
        if (confirm('Bạn có muốn lưu thay đổi không?')) {
            const $commentItem = $(e.target).closest('.comment-item');
            const newCommentText = $commentItem.find('.edit-comment-input').val();
            const formattedComment = newCommentText.replace(/\n/g, '<br>');
            $commentItem.find('p').html(formattedComment).show();
            $commentItem.find('.delete-comment, .edit-comment').show();
            $commentItem.find('.edit-comment-input, .save-comment, .cancel-comment').remove();
        }
    }
});

// Hủy thay đổi khi chỉnh sửa bình luận
$(document).on('click', '#post-container', function(e) {
    if ($(e.target).hasClass('cancel-comment')) {
        if (confirm('Bạn có chắc muốn hủy các thay đổi không?')) {
            const $commentItem = $(e.target).closest('.comment-item');
            $commentItem.find('p, .delete-comment, .edit-comment').show();
            $commentItem.find('.edit-comment-input, .save-comment, .cancel-comment').remove();
        }
    }
});
//kích thước cho teatarea
// Toggling visibility of the comment input area
$(document).on('click', '.comment-button', function () {
    const $commentsDiv = $(this).closest('.post').find('.comments');
    const $commentInput = $commentsDiv.find('.comment-input');
    const $submitButton = $commentsDiv.find('.submit-comment');
    const $commentListContainer = $commentsDiv.find('.comment-list-container');

    if ($commentInput.is(':visible')) {
        $commentInput.hide().val('').height('auto'); // Ẩn textarea và đặt lại kích thước
        $submitButton.hide();
    } else {
        $commentInput.show().focus().height('auto'); // Hiện textarea và đặt kích thước mặc định
        $submitButton.show();
        $commentListContainer.show();
    }
});

// Ẩn bình luận khi nhấn ra ngoài phần bình luận và bài viết
$(document).click(function (e) {
    const target = $(e.target);

    // Nếu không nhấn vào các phần tử liên quan đến bình luận
    if (
        !target.closest('.post, .comments, .comment-button, .edit-comment, .delete-comment, .save-comment, .cancel-comment, .edit-comment-input').length
    ) {
        // Ẩn phần bình luận đang hiển thị
        $('.comment-list-container:visible').hide();
        $('.comment-input:visible').hide().val('').height('auto'); // Đặt lại textarea về giá trị mặc định
        $('.submit-comment:visible').hide();
    }
});

// Tự động thay đổi chiều cao của textarea khi nhập nội dung
$(document).on('input', '.comment-input', function () {
    $(this).height('auto').height(this.scrollHeight); // Điều chỉnh chiều cao theo nội dung
});
