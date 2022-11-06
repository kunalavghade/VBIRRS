// Jquery for convenience
$(function () {
	// Global ajax setup
	const CANVAS_WIDTH = 865;
	const CANVAS_HEIGHT = 540;
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
				video: { width: { ideal: 1920 } },
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
});
