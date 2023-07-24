// Rể chuột show content
$(document).ready(function () {
    // Activate Bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();
});

// Hàm để cắt ngắn nội dung quá dài
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    }
    return text;
}



// call api get all
function loadPosts() {
    $.get("https://news-watch-production.up.railway.app/api/v1/post/get-all", function (response) {
        if (response.result === "Get data success" && response.data) {
            const data = response.data;

            $("#postTable tbody").empty();

            for (let i = 0; i < data.length; i++) {
                const post = data[i];

                //"Category(id=2, name=Esports)"
                const categoryName = post.category.match(/name=(\w+)/);
                const category = categoryName ? categoryName[1] : "";

                const row = `
                    <tr>
                    <td>${i + 1}</td>
                    <td>${post.title}</td>
                    <td data-toggle="tooltip" data-html="true" title="${post.content}">${truncateText(post.content, 100)}</td>
                    <td><img src="${post.urlImage}" alt="" style="max-width: 100px; height: auto;"></td>
                    <td data-toggle="tooltip" data-html="true" title="${category}">${truncateText(category, 100)}</td>
                    <td>${post.createdAt}</td>
                    <td>
                        <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons"
                                data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        <a href="#deletePostModal" class="delete" data-toggle="modal" data-id="${post.id}"><i
                                class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                </tr>
                `;

                $("#postTable tbody").append(row);
            }
        } else {
            console.log("Error: Unable to fetch data from the API.");
        }
    }).fail(function () {
        console.log("Error: Failed to make API call.");
    });
}

loadPosts();


// Call API get all categorie
function loadCategories() {
    // Call the API to get all categories
    $.get("https://news-watch-production.up.railway.app/api/v1/category/get-all", function (response) {
        if (response.result === "Get data success" && response.data) {
            const categories = response.data;

            $("#category").empty();

            // Add the default option
            $("#category").append('<option value="" disabled selected>Select Category</option>');

            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                $("#category").append(`<option value="${category.id}">${category.name}</option>`);
            }
        } else {
            console.log("Error: Unable to fetch categories from the API.");
        }
    }).fail(function () {
        console.log("Error: Failed to make API call to get categories.");
    });
}

// Function to handle form submission
$("#addPostForm").submit(function (event) {
    event.preventDefault();

    // Lấy giá trị từ form
    const title = $("#title").val();
    const content = $("#content").val();
    const categoryId = $("#category").val();
    const image = $("#image")[0].files[0];

    // Tạo formData để gửi dữ liệu
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    formData.append("image", image);

    // Gửi yêu cầu tới API
    $.ajax({
        url: "https://news-watch-production.up.railway.app/api/v1/post/add",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.result === "Save success") {
                window.location.reload();

            } else {
                console.log("Error: Failed to add the category.");
            }
        },
        error: function (error) {
            console.log("Error: ", error);
        },
    });
});

// Call the function to load categories and update the select dropdown
loadCategories();


$(document).on("click", ".delete", function () {
    const postId = $(this).data("id");
    console.log(postId);

    // Hiển thị form xác nhận xóa
    $("#deletePostModal").modal("show");

    // Xử lý submit form xác nhận xóa
    $("#deletePostForm").submit(function (event) {
        event.preventDefault();

        // Gửi yêu cầu DELETE tới API
        $.ajax({
            url: `https://news-watch-production.up.railway.app/api/v1/post/${postId}`,
            type: "DELETE",
            success: function (response) {
                if (response.result === "Delete success") {
                    window.location.reload();
                } else {
                    console.log("Error: Failed to delete the post.");
                }
            },
            error: function (error) {
                console.log("Error: ", error);
            },
        });

        // Đóng form xác nhận xóa
        $("#deletePostModal").modal("hide");
    });
});