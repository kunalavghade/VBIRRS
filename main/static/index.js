// Jquery for convenience
$(function () {
	const titleTag = $("h1#title");
	titleTag.text("Vegetables Detected");

	const mobileCheck = function () {
		let check = false;
		(function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				check = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		if (check) {
			$("#cambtn").fadeOut();
		} else {
			$("#cambtn").fadeIn();
		}
	};
	window.addEventListener("resize", mobileCheck);
	mobileCheck();

	// Global ajax setup
	const CANVAS_WIDTH = 1080;
	const CANVAS_HEIGHT = 650;
	const canvasCtrl = $("#canvas-ctrl");
	$.ajaxSetup({
		headers: {
			"X-CSRFToken": getCookie("csrftoken"),
		},
	});
	console.log("Loaded");
	const nav = $("nav");
	const canvas = $("#canvas-ctrl canvas")[0];
	const videoTag = $("#video-ctrl video")[0];
	const videoWrapper = $(".video-wrapper");
	const loaderAnim = $(".wrapper");
	let localStream;
	let width, height;
	let streaming = false;
	$(".nav-link.current").removeClass("current");
	$(`.nav-link[href='${window.location.pathname}']`).addClass("current");
	$("#open").on("click", function () {
		nav.addClass("active");
	});
	$("#close").on("click", function () {
		nav.removeClass("active");
	});
	$("#cambtn").on("click", function () {
		navigator.mediaDevices
			.getUserMedia({
				video: { width: { ideal: 1920 }},
				audio: false,
			})
			.then((stream) => {
				videoTag.srcObject = stream;
				localStream = stream;
				videoWrapper.addClass("viewing");
			})
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});
		videoTag.addEventListener("canplay", (ev) => {
			if (!streaming) {
				width = videoTag.offsetWidth;
				height =
					(videoTag.videoHeight / videoTag.videoWidth) * videoTag.offsetWidth;

				videoTag.setAttribute("width", width);
				videoTag.setAttribute("height", height);
				canvas.setAttribute("width", CANVAS_WIDTH);
				canvas.setAttribute("height", CANVAS_HEIGHT);
				console.log(width, height);
				videoTag.play();

				streaming = true;
			}
		});
	});

	$("#capture").on("click", function () {
		const context = canvas.getContext("2d");
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		canvas.setAttribute("width", CANVAS_WIDTH);
		canvas.setAttribute("height", CANVAS_HEIGHT);
		context.drawImage(videoTag, 0, 0, canvas.width, canvas.height);
		console.log(canvas.width, canvas.height);
		canvasCtrl.addClass("captured");
		document
			.getElementById("webimg")
			.setAttribute("value", canvas.toDataURL("image/png"));
	});
	$("#stop").on("click", function () {
		videoTag.pause();
		streaming = false;
		videoTag.srcObject = null;
		localStream.getTracks()[0].stop();
		videoWrapper.removeClass("viewing");
		canvasCtrl.removeClass("captured");
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	});

	// ajax calls
	function getCookie(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) c_end = document.cookie.length;
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	}
	$("form[name='inputForm']").on("submit", function (evt) {
		evt.stopImmediatePropagation();
		evt.preventDefault();
		if ($("#webimg").val() === "" && $("#uploadfile").val() === "") {
			alert("Either upload a file or take a snapshot!");
			return false;
		}
		const form = new FormData($(this)[0]);
		$.ajax({
			url: "/main",
			method: "POST",
			data: form,
			processData: false,
			contentType: false,
			cache: false,
			beforeSend() {
				// Load Animation on
				loaderAnim.addClass("loading");
				$("#resp li").remove("li");
			},
			success: function (data) {
				console.log("success");
				const { msg } = data;
				console.log(data);
				if (msg === "Received") {
					// load animation removed
					$("input[name='uploadfile']").val("");
					loaderAnim.removeClass("loading");
					const { veggies } = data;
					veggies.forEach((veg) => {
						$("#resp").append(`<li>${veg}</li>`);
					});
				}
			},
			error: function (data) {
				console.log("error");
				console.log(data);
			},
		});
		console.log(form);
		console.log("Form Submitting..");
		return false;
	});
	
	const obj = {
		msg: "Received",
		veggies: ["Green Chili", "Onion", "Potato", "Tomato", "cucumber"],
		recipe: [
			{ name: "bhuna pyaaz", tag: "spicy" },
			{ name: "marmalade", tag: "sweet" },
			{ name: "onion soup", tag: "soup" },
			{ name: "pyaaz ka raita", tag: "spicy" },
			{ name: "ringes", tag: "snack" },
			{ name: "aloo mutter", tag: "spicy" },
			{ name: "aloo posto", tag: "spicy" },
			{ name: "aloo tikki", tag: "spicy" },
			{ name: "dum aloo", tag: "spicy" },
			{ name: "jeera aloo", tag: "spicy" },
			{ name: "choka", tag: "spicy" },
			{ name: "chutney", tag: "spicy" },
			{ name: "curry", tag: "tangy" },
			{ name: "sambar", tag: "spicy" },
			{ name: "sauce", tag: "sweet" },
			{ name: "chilled cucumber soup", tag: "soup" },
			{ name: "salad", tag: "spicy" },
		],
	};

	obj.recipe.forEach((recp) => {
		console.log(recp);
		$("#recipes").append(
			`<li>
			<h2 class="title">${recp.name}</h2>
			<div class="tags">
				<span class="tag">${recp.tag}</span>
			</div>
		</li>
			`
		);
	});
});
