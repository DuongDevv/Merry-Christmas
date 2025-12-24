
const messages = [
    "🎄Merry Christmas Bé cưng💖",
    "Giữa rất nhiều điều xảy ra trong năm nay,",
    "Có một điều anh chưa bao giờ cảm thấy hối hận...",
    "Đó chính là yêu em.",
    "Anh không biết giáng sinh này em có điều ước gì,",
    "nhưng nếu anh được ước một điều thì...",
    "đó chính là...",
    "Anh và em sẽ bên nhau mãi mãi~~~",
    "---Tổng tài của em---"
];

let msgIndex = 0;
let charIndex = 0;
const speed = 90;
const typeArea = document.getElementById("typewriter");

function typeWriter() {
    if (charIndex < messages[msgIndex].length) {
        typeArea.innerHTML += messages[msgIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(() => eraseText(), 1500);
    }
}

function eraseText() {
    if (charIndex > 0) {
        typeArea.innerHTML = messages[msgIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 40);
    } else {
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(typeWriter, 300);
    }
}

setTimeout(typeWriter, 6000);
MorphSVGPlugin.convertToPath('polygon');
var xmlns = "http://www.w3.org/2000/svg",
    xlinkns = "http://www.w3.org/1999/xlink",
    select = function (s) {
        return document.querySelector(s);
    },
    selectAll = function (s) {
        return document.querySelectorAll(s);
    },
    pContainer = select('.pContainer'),
    mainSVG = select('.mainSVG'),
    star = select('#star'),
    sparkle = select('.sparkle'),
    tree = select('#tree'),
    showParticle = true,
    particleColorArray = ['#E8F6F8', '#ACE8F8', '#F6FBFE', '#A2CBDC', '#B74551', '#5DBA72', '#910B28', '#910B28', '#446D39'],
    particleTypeArray = ['#star', '#circ', '#cross', '#heart'],
    particlePool = [],
    particleCount = 0,
    numParticles = 201


gsap.set('svg', {
    visibility: 'visible'
})

gsap.set(sparkle, {
    transformOrigin: '50% 50%',
    y: -100
})

let getSVGPoints = (path) => {

    let arr = []
    var rawPath = MotionPathPlugin.getRawPath(path)[0];
    rawPath.forEach((el, value) => {
        let obj = {}
        obj.x = rawPath[value * 2]
        obj.y = rawPath[(value * 2) + 1]
        if (value % 2) {
            arr.push(obj)
        }
    })

    return arr;
}
let treePath = getSVGPoints('.treePath'),
    treeBottomPath = getSVGPoints('.treeBottomPath'),
    mainTl = gsap.timeline({ delay: 0, repeat: 0 }),
    starTl;

function flicker(p) {

    gsap.killTweensOf(p, { opacity: true });
    gsap.fromTo(p, {
        opacity: 1
    }, {
        duration: 0.07,
        opacity: Math.random(),
        repeat: -1
    })
}

function createParticles() {

    var i = numParticles, p, particleTl, step = numParticles / treePath.length, pos;
    while (--i > -1) {

        p = select(particleTypeArray[i % particleTypeArray.length]).cloneNode(true);
        mainSVG.appendChild(p);
        p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
        p.setAttribute('class', "particle");
        particlePool.push(p);
        gsap.set(p, {
            x: -100,
            y: -100,
            transformOrigin: '50% 50%'
        })



    }

}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p) {
    if (!showParticle) { return };
    var p = particlePool[particleCount]
    gsap.set(p, {
        x: gsap.getProperty('.pContainer', 'x'),
        y: gsap.getProperty('.pContainer', 'y'),
        scale: getScale()
    }
    );
    var tl = gsap.timeline();
    tl.to(p, {
        duration: gsap.utils.random(0.61, 6),
        physics2D: {
            velocity: gsap.utils.random(-23, 23),
            angle: gsap.utils.random(-180, 180),
            gravity: gsap.utils.random(-6, 50)
        },
        scale: 0,
        rotation: gsap.utils.random(-123, 360),
        ease: 'power1',
        onStart: flicker,
        onStartParams: [p],
        onRepeat: (p) => {
            gsap.set(p, {
                scale: getScale()
            })
        },
        onRepeatParams: [p]

    });


    particleCount++;
    particleCount = (particleCount >= numParticles) ? 0 : particleCount

}

function drawStar() {

    starTl = gsap.timeline({ onUpdate: playParticle })
    starTl.to('.pContainer, .sparkle', {
        duration: 6,
        motionPath: {
            path: '.treePath',
            autoRotate: false
        },
        ease: 'linear'
    })
        .to('.pContainer, .sparkle', {
            duration: 1,
            onStart: function () { showParticle = false },
            x: treeBottomPath[0].x,
            y: treeBottomPath[0].y
        })
        .to('.pContainer, .sparkle', {
            duration: 2,
            onStart: function () { showParticle = true },
            motionPath: {
                path: '.treeBottomPath',
                autoRotate: false
            },
            ease: 'linear'
        }, '-=0')
        .from('.treeBottomMask', {
            duration: 2,
            drawSVG: '0% 0%',
            stroke: '#FFF',
            ease: 'linear'
        }, '-=2')

}


createParticles();
drawStar();

mainTl.from(['.treePathMask', '.treePotMask'], {
    duration: 6,
    drawSVG: '0% 0%',
    stroke: '#FFF',
    stagger: {
        each: 6
    },
    duration: gsap.utils.wrap([6, 1, 2]),
    ease: 'linear'
})
    .from('.treeStar', {
        duration: 3,
        scaleY: 0,
        scaleX: 0.15,
        transformOrigin: '50% 50%',
        ease: 'elastic(1,0.5)'
    }, '-=4')

    .to('.sparkle', {
        duration: 3,
        opacity: 0,
        ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})"
    }, '-=0')
    .to('.treeStarOutline', {
        duration: 1,
        opacity: 1,
        ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
    }, '+=1')

mainTl.add(starTl, 0)
gsap.globalTimeline.timeScale(1.5);

function createSnowflake() {
    const snow = document.createElement("div");
    snow.classList.add("snowflake");
    snow.textContent = "❄";
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.fontSize = (Math.random() * 15 + 10) + "px";
    snow.style.animationDuration = (Math.random() * 5 + 5) + "s";
    snow.style.opacity = Math.random();
    document.body.appendChild(snow);
    setTimeout(() => {
        snow.remove();
    }, 10000);
}

setInterval(createSnowflake, 150);

const bgm = document.getElementById("bgm");

document.addEventListener("DOMContentLoaded", () => {
    bgm.currentTime = 55;

    const attempt = bgm.play();

    if (attempt !== undefined) {
        attempt.catch(() => {
            console.log("Autoplay bị chặn trên mobile.");
        });
    }

    const santa = document.querySelector(".santa-claus");
    if (santa) {
        santa.addEventListener("click", () => {
            bgm.currentTime = 55;
            bgm.play();
        });
    }
});

function enableMusicOnTouch() {
    bgm.currentTime = 55;
    bgm.play();

    document.removeEventListener("touchstart", enableMusicOnTouch);
    document.removeEventListener("click", enableMusicOnTouch);
}

document.addEventListener("touchstart", enableMusicOnTouch);
document.addEventListener("click", enableMusicOnTouch);

// --- PHẦN THÊM KHUNG ẢNH ---
// Bạn hãy thay thế các đường link bên dưới bằng link ảnh của bạn nhé
const myPhotos = [
    "img/z7362213762615_a19935a16e006f1469d634f8f40d3582.jpg",
 "img/z7362213762618_77fc4535f69a787e193fe2f313541f1b.jpg",
 "img/z7362213763685_978ab04f292792fcc9b842dc30ec02f5.jpg",
 "img/z7362213763789_61e9d01fe4ee49bafb9813282ce192cf.jpg",
 "img/z7362213763790_f1b0430ca4b15912ce9c431aadb2f70f.jpg",
 "img/z7362213763793_656fd743ed938d78123644bfc83abf87.jpg",
 "img/z7362213764249_d680d087e58d123356450e96dc1b189c.jpg",
 "img/z7362213772492_5a626faf77c72ddfabba9fe005945ac7.jpg",
 "img/z7362213772493_4cd66c8aa94bd56f3f582992b8f0562c.jpg",
 "img/z7362213772498_66b98919b5b5ed937d596766384cc331.jpg",
 "img/z7362213772734_c77d2fa7360d55da395e45aa71403c68.jpg",
 "img/z7362213772825_20ecc352b061803dd7a4a96b3496d16f.jpg",
 "img/z7362213773145_1c8d07875fd06616ca9f7b8499febd75.jpg",
 "img/z7362213773147_e21c90733f2a138191ed5bd785744a3b.jpg",
 "img/z7362213773303_9fcf503a6e1c6737c7beec40ced7028c.jpg",
 "img/z7362213773346_1c3339939f5d0976e7bc64ca8c6a5914.jpg",
 "img/z7362213773981_a0bb7fd4ad4df927e91f6f3bd334c0ff.jpg",
 "img/z7362213773983_faab38ee925b84f393498a4715e78af2.jpg",
 "img/z7362213774020_948dadc232b45ccb56a69d8c7aeab74e.jpg",
 "img/z7362213774053_e22a522ad8a2cefc7c454613ce32f384.jpg",
 "img/z7362213774120_65e7695005706578ab3bfefe6302e0a9.jpg",
 "img/z7362213774150_464775b9e84062cb71f221b72ecec2e5.jpg",
 "img/z7362213774184_2caba4f2d1810a9c5b3ea653defcb84d.jpg",
 "img/z7362213774300_88dbc59b2552c7e6f0af698d580120a8.jpg",
 "img/z7362213774332_9c20aa176b6b1087a5febe5242c10fcf.jpg",
 "img/z7362213774400_92ed28dd8f8905f497bf4687ec9190f5.jpg",
 "img/z7362213774440_d164a73c4df45a3363a06a53f991a193.jpg",
 "img/z7362213774441_0b0287e992ddf85b1083d9a1a4d08cd3.jpg",
 "img/z7362213774504_a69181f72656a6162175896858b432d0.jpg",
 "img/z7362213774670_296e90a4e4dc9d5129209d8ff18b02fd.jpg",
 "img/z7362213774853_1e217f06f23c4494d8d4642e8bfa55c2.jpg",
 "img/z7362213774863_a9ce3fc0f8a2bd0d689c6a77c70d2d57.jpg",
 "img/z7362213774937_e0f777f3a4924f17527d54e5d31267ad.jpg",
 "img/z7362213775153_034de9eb84708e712a537227d2ee1464.jpg",
 "img/z7362213775817_6e01f8b605a3f40a4d0e567d2f6587eb.jpg",
 "img/z7362213775964_16f692692da87199be262dd16da02085.jpg",
 "img/z7362213776239_178967f4c3007a454e3797f0a84e1b21.jpg",
 "img/z7362213777026_71b0ea90536c658afcda17b01e149b2b.jpg",
 "img/z7362213777041_eac2c26b9fdcc010c465e0d006767753.jpg",
 "img/z7362213783159_531014eac8925e5a990766d76b47ef02.jpg",
 "img/z7362213783302_ed8c0985f390fe281561146c47cd4050.jpg",
 "img/z7362213783738_595abf56f298a55f945c42fc670ee6a3.jpg",
 "img/z7362213783863_f03efd29ac45e08fb6b65b431d9a3e98.jpg",
 "img/z7362213784009_e59ec76da83e5affd2233f7616c617c0.jpg",
 "img/z7362213784018_3af8f4a2c83777c6064389488177e6ff.jpg",
 "img/z7362213784265_8cf5a7bc7f3ddc6f346de6b7710fe998.jpg",
 "img/z7362213784271_461f4f082224878bf8f156b5a699b8c4.jpg",
 "img/z7362213784418_b45ecf52202f45a176c3e2e7364670d5.jpg",
 "img/z7362213818451_08997f03f5a19bd4ce927bb2f1d2151c.jpg",
 "img/z7362213818995_4fa8eb7bc2bf74dad5e29fec6f5c6ea9.jpg",
 "img/z7362214121345_24e242644e1c8b7d8292222766a3b78a.jpg",
 "img/z7362214122486_aebf4b2a218a3b7629b2f54872210985.jpg",
 "img/z7362214122562_dfb29c12ae13484fa6c7c79f489e0ae4.jpg",
 "img/z7362214122679_8aed5233e298a645b7a154214fd11e1b.jpg",
 "img/z7362214123195_e2c5f497c2d04248c1155040505052ca.jpg",
 "img/z7362214123908_b8df6147fdf4916a6bca81c5144abad8.jpg",
 "img/z7362214125637_4e240dfd147cb086772b9fda67be4b4d.jpg",
 "img/z7362214125786_294bd81cd3c10b026b7a48a665901c63.jpg",
 "img/z7362214126069_43aa362fad212b81346112cc0374e345.jpg",
 "img/z7362214126283_e353437e512d5f5a2aa867aad436b188.jpg",
 "img/z7362214126436_2c3352eb522aaee1aa598c6f24dd793c.jpg",
 "img/z7362214126702_5bb6ace85769b76b592c1cfbc32eeb51.jpg",
 "img/z7362214126711_43f42f42679524785a8f657be96883e2.jpg",
 "img/z7362214130375_073109a223a2d1e29e27a487d6903ebd.jpg",
 "img/z7362214134735_668241b0e348d309cd59bc493d8b51de.jpg",
 "img/z7362214134850_1570dc7b71ff278a422c3a601ceb16c6.jpg",
 "img/z7362214134851_936f027e0732ff848b2cf5baf6729efa.jpg",
 "img/z7362214135372_990a7aa35fa3addcb0d5684960bd317b.jpg",
 "img/z7362214135373_93274447c26e6ec36e6bb18b73a5d267.jpg",
 "img/z7362214135531_b4d7b829e188e36c864f7bcba91f533b.jpg",
 "img/z7362214135535_e6309547a7d81708d76c2a3207926c5a.jpg",
 "img/z7362214135536_6325bf5da301da37d2d5ab8a474511f9.jpg",
 "img/z7362214135984_7e05a1408ae53376567bda3add4abfe2.jpg",
 "img/z7362214135989_a057866c9775cda4a37295e043655262.jpg",
 "img/z7362214138006_73279cb636fc88fb8a076d0b8cead918.jpg",
 "img/z7362214138263_f2bb99061f2e50da6768cfbf42b74e29.jpg",
 "img/z7362214139652_80f3e1d71ff60a03507c9d4b675fe26d.jpg",
 "img/z7362214156482_f70470f2134abb1afe03faab213106bc.jpg",
 "img/z7362214156786_e9442b5c6d3caa9393aa37c806a9ca60.jpg",
 "img/z7362214156787_b61ba2fb7f90b34422a2d27d8f8a4346.jpg",
 "img/z7362214157233_d43a886c7f6cd7b1efd7ca29917ea361.jpg",
 "img/z7362214157468_f806e1cb2658e8473158d97b4ce45609.jpg",
 "img/z7362214157469_b07eb3ae3c3966b2e2e726366ccde79e.jpg",
 "img/z7362214157470_c28797036a32c4c44ae2fbee2a7e0c26.jpg",
 "img/z7362214157564_53fd5d71820e16cb35145baa8df63c63.jpg",
 "img/z7362214158376_7adb97ca402bc68882327ce0bfcae78f.jpg",
 "img/z7362214158377_31e5f5e924259e86a9e0888aabcd3445.jpg",
 "img/z7362214158378_22f21514791895d63a6774c74fcda688.jpg",
 "img/z7362214163433_ba1460d45b0e5511dc9bc77d57928810.jpg",
 "img/z7362214218514_b099b481674ada26cdee74d72ae31260.jpg",    


];

function createPhotoFrame() {
    if (myPhotos.length === 0) return;
    const frame = document.createElement("div");
    frame.classList.add("photo-frame");
    
    const img = document.createElement("img");
    img.src = myPhotos[Math.floor(Math.random() * myPhotos.length)];
    frame.appendChild(img);
    
    // Vị trí ngẫu nhiên theo chiều ngang
    frame.style.left = Math.random() * (window.innerWidth - 150) + "px";
    // Tốc độ rơi ngẫu nhiên (chậm hơn tuyết một chút, từ 10s đến 20s)
    const duration = Math.random() * 10 + 10; 
    frame.style.animationDuration = duration + "s";
    
    document.body.appendChild(frame);
    
    // Xóa khung sau khi rơi xong để tránh nặng máy
    setTimeout(() => {
        frame.remove();
    }, duration * 1000);
}

// Tạo khung ảnh mới mỗi 3 giây
setInterval(createPhotoFrame, 3000);
