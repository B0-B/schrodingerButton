/*#############################################################################
schrodingerButton.js: An impossible button implementation with motion graphics.
GNU GENERAL PUBLIC LICENSE - Version 3, 29 June 2007
Copyright © 2007 Free Software Foundation, Inc. <https://fsf.org/>
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.
Autor copyright © github.com/B0-B 2023.
############################################################################### */
(async () => {

    // -- dock to dom --
    const mainWrapper = document.getElementById('schrodinger-button');
    const canvas = document.createElement('canvas');
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    mainWrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const ctc = ctx.canvas;
    const [ h, w ] = [ ctc.height, ctc.width ] = [ mainWrapper.clientHeight, mainWrapper.clientWidth ];



    // -- global methods --
    // iid
    function u() {return Math.random()};
    // sound
    function au(b64){return new Audio("data:audio/mpeg;base64,"+b64)}
    // motion
    function transition (s, steps, type='linear') {
        if ( type == 'linear' ) {
            return s / (steps-1)
        } else if ( type == 'hyperbolic' ) {
            return 1 - 1 / (s+1)
        } else if ( type == 'sin' ) {
            const dx = Math.PI / 2 / steps;
            return Math.sin(dx * s);
        } else if ( type == 'sigmoid' ) {
            return 1/(1+Math.exp(-(-4+8*s/(steps-1))))
        }
    }
    // GL
    function circ (x, y, r, stroke=null, strokeWidth=3) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
        if (stroke) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = stroke;
            ctx.stroke()
        }
    }


    // ---- Button ----

    // button parameters
    mainWrapper.buttonState = 0;
    var dir = 0;

    // describe everything in relative coords
    function x (x) { return x * w }
    function y (y) { return y * h }

    function drawButton (knobPosition=0) {

        /* Renders the base button. */

        const radius = y(.1);
        const off = .2;

        ctx.fillStyle = '#ddd';
        
        ctx.fillRect(x(.5-off),y(.4),x(2*off),2*radius);
        for (let i of [-1, 1]) {
            circ(x(.5+i*off), y(.5), radius)
        }
        
        // load strip
        ctx.fillStyle = '#46e089';
        ctx.shadowColor = ctx.fillStyle;
        circ(x(.5-off), y(.5), radius)
        ctx.fillRect( x(.5-off), y(.4), x(2*knobPosition*off), y(.2) );

        // knob
        ctx.fillStyle = '#444';
        
        circ(x(.5+(-1+2*knobPosition)*off), y(.5), radius, 'white');

    }

    
    
    // -- cat --
    var meow = au("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");
    var catColor = '#222';
    if (Object.keys(mainWrapper.attributes).includes('color') && mainWrapper.attributes.color.value) {
        catColor = mainWrapper.attributes.color.value;
    }

    const speechBubbleScale = w/200/2.5;
    var speechBubbleOpacity = 0;
    var pawState = 0;
    var catAngry = 0;
    var phrases = [
        'HΨ = EΨ',
        '#$!?',
        '🐟',
        '🐁',
        '☢️'
    ]
    var phrase = phrases[0];
    var pupils = 1;
    var lidsMax = .7;
    var lids = lidsMax;
    var tail = {
        x: x(.18), 
        y: y(.73), 
        x0: x(.35),
        y0: y(.35),
        e: .2,
        d: .1
    };

    async function drawCatBody () {

        // back

        ctx.beginPath();
        ctx.fillStyle = catColor;
        const cut = 2.755;
        const start = - Math.PI/2
        ctx.arc(x(.5), y(.5), x(.24), -Math.PI/cut+start, Math.PI/cut+start);
        ctx.closePath();
        ctx.fill();
        
        // head
        ctx.fillRect(x(.6), y(.25), y(.15), y(.18));
        
        ctx.beginPath();
        
        // left ear
        ctx.moveTo(x(.6), y(.25));
        ctx.lineTo(x(.6), y(.2));
        ctx.lineTo(x(.65), y(.25));
        ctx.lineTo(x(.6), y(.25));

        // right ear
        ctx.moveTo(x(.6) + y(.15), y(.25));
        ctx.lineTo(x(.6) + y(.15), y(.2));
        ctx.lineTo(x(.6) + y(.1), y(.25));
        ctx.lineTo(x(.6) + y(.15), y(.25));

        ctx.closePath();
        ctx.fill();

        // eyes
        const eyeDist = 0.04;
        const eyeInnerRad = y(.006)
        const eyeOuterRad = y(.012)

        ctx.fillStyle = 'white';
        
        circ(x(.6+eyeDist), y(.29), eyeOuterRad);
        circ(x(.6) + y(.15-eyeDist), y(.29), eyeOuterRad);

        // pupils
        ctx.fillStyle = 'green';

        circ(x(.6+eyeDist), y(.29+.01*(1-pupils)), eyeInnerRad);
        circ(x(.6) + y(.15-eyeDist), y(.29+.01*(1-pupils)), eyeInnerRad);


        // nose
        ctx.moveTo(x(.6) + y(.075), y(.305), eyeInnerRad);
        ctx.beginPath();
        ctx.lineTo(x(.61) + y(.075), y(.315) , eyeInnerRad);
        ctx.lineTo(x(.59) + y(.075), y(.315), eyeInnerRad);
        ctx.lineTo(x(.6) + y(.075), y(.325), eyeInnerRad);
        ctx.closePath();
        ctx.fillStyle = '#eb4664';
        ctx.fill()

        // lids
        ctx.fillStyle = catColor;
        const a = 2*eyeOuterRad;

        if (catAngry) {
            ctx.save()
            ctx.rotate(.5)
        }
        ctx.fillRect(x(.6+eyeDist)-y(0)-a/2, y(.29)-a/2-a*lids, a, a);
        if (catAngry) {
            ctx.save()
            ctx.rotate(-.5)
        }
        ctx.fillRect(x(.6)+y(.15-eyeDist)-y(0)-a/2, y(.29)-a/2-a*lids, a, a);
        if (catAngry) {
            ctx.restore()
        }
    }

    async function moveTail () {

        var [ t, dt ] = [ 0, 10 ];
        const omega = .003;
        const decline = .002;
        let U = []; for (let i = 0; i < 6; i++) { U.push(u()) }

        while (true) {
            let dec = Math.exp(decline*(1+U[4])*1e1*Math.sin(.001*(1+U[5])*t));
            tail.x = x(.27 + 0.08 * dec * Math.sin( omega * t + .2 * U[0] ) );
            tail.y = y(.7 + 0.04 * dec * Math.sin( omega * t + .2 * U[1] ) );
            tail.e = (.3 + .1 * U[3]) * dec * Math.cos( omega * t + .6 * U[2] );
            await new Promise( r => setTimeout(r, dt) )
            t += dt;
            render()
        }

    }

    async function drawTail () {

        // model the tail
        const [dx, dy] = [tail.x-tail.x0,tail.y-tail.y0];
        const [px, py] = [-tail.e*dy, tail.e*dx];
        const [ax, ay] = [tail.x0+dx*.5,tail.y0+dy*.5];
        const [xc, yc] = [ax+px, ay+py]; 

        ctx.beginPath();
        ctx.moveTo(x(.35), y(.35));
        ctx.quadraticCurveTo(xc, yc, tail.x, tail.y);
        ctx.strokeStyle = catColor;
        ctx.lineWidth = 12;
        ctx.stroke();

        ctx.fillStyle = catColor;
        circ(tail.x,tail.y,6)

    }

    function drawSpeechBubble (_x, _y, scale=1.0) {
        // Quadratic curves example
        const s = scale;
        ctx.save()
        ctx.beginPath();
        ctx.translate(-20+_x, -20+_y);
        ctx.scale(s,s);
        ctx.moveTo(75, 25);
        ctx.quadraticCurveTo(25, 25, 25, 62.5);
        ctx.quadraticCurveTo(25, 100, 50, 100);
        ctx.quadraticCurveTo(50, 120, 30, 125);
        ctx.quadraticCurveTo(60, 120, 65, 100);
        ctx.quadraticCurveTo(125, 100, 125, 62.5);
        ctx.quadraticCurveTo(125, 25, 75, 25);
        ctx.lineWidth = Math.floor(x(0.02));
        ctx.strokeStyle = `rgba(200,200,240,${speechBubbleOpacity})`;
        ctx.stroke();
        
        ctx.fillStyle = `rgba(220,220,220,${speechBubbleOpacity})`;
        ctx.fill()
        ctx.closePath();
        ctx.restore()

        const fontSize = Math.floor(w/200*8);
        ctx.font = `bold ${fontSize}px Arial`
        ctx.fillStyle = `rgba(0,0,0,${speechBubbleOpacity})`;
        let t = ctx.measureText(phrase);
        console.log(t)
        ctx.fillText(phrase,_x+x(.1)-t.width/2,_y+y(.16)/2,100);
        resetTransform();
        
    }

    function resetTransform () {
        ctx.scale(1,1);
        ctx.translate(0, 0);
        ctx.rotate(0,0);
        ctx.restore();
    }

    function drawPaw () {

        ctx.fillStyle = catColor;
        circ(x(.6+(1-pawState)*.15),y(.4),y(.03))

    }

    async function blinkRandomly () {
        while (true) {
            if (lids == lidsMax && u() < .02) {
                blink()
            }
            await new Promise( r => setTimeout(r, 100) )
        }
    }

    async function blink () {
        // lower eye lids
        var [ T, dt ] = [ 100, 10 ];
        let steps = Math.floor(T/dt);
        for (let t = 0; t < steps; t++) {
            lids = lidsMax * (1 - transition(t,steps,'sigmoid'));
            await new Promise( r => setTimeout(r, dt) )
        }
        // lower eyes
        [ T, dt ] = [ 100, 10 ];
        steps = Math.floor(T/dt);
        for (let t = 0; t < steps; t++) {
            lids = lidsMax * transition(t,steps,'sigmoid');
            await new Promise( r => setTimeout(r, dt) )
        }
        lids = lidsMax;
    }

    async function raiseEyes () {
        // raise eyes
        [ T, dt ] = [ 100, 10 ];
        steps = Math.floor(T/dt);
        for (let t = 0; t < steps; t++) {
            pupils = transition(t,steps,'sigmoid')
            await new Promise( r => setTimeout(r, dt) )
        }
    }

    async function lowerEyes () {
        var [ T, dt ] = [ 100, 10 ];
        let steps = Math.floor(T/dt);
        for (let t = 0; t < steps; t++) {
            pupils = 1 - transition(t,steps,'sigmoid')
            await new Promise( r => setTimeout(r, dt) )
        }
    }


      
    // -- animate --
    async function flipAnimate () {
        
        const [ dt, T, s ] = [ 5, 100, mainWrapper.buttonState ];
        dir = s;
        const steps = Math.floor(T/dt);
        
        for (let i = 0; i < steps; i++) {
            if (dir != s) {return}
            mainWrapper.buttonState = transition(i, steps, 'sigmoid');
            if (s > 0) {
                mainWrapper.buttonState = 1-mainWrapper.buttonState;
            }
            await new Promise( r => setTimeout(r,dt) )
        }

        if ( s > 0 ) {
            mainWrapper.buttonState = 0
        } else {
            mainWrapper.buttonState = 1
        }

        
    }
    
    async function render () {

        /* Renders new scene in current state */

        ctx.clearRect(0, 0, h, w);

        await drawCatBody();

        await drawTail();

        await drawButton(mainWrapper.buttonState);
        
        await drawPaw();

        if (speechBubbleOpacity > 0) {
            await drawSpeechBubble(x(.75), y(.12), speechBubbleScale)
        }

    }



    // -- rejection algorithm --
    var count = 0;
    async function reject () {

        while (true) {

            if ( mainWrapper.buttonState == 1 ) {

                await new Promise( r => setTimeout(r, u()*1000) )
    
                // lower eyes
                await lowerEyes();

                // dramatic waiting
                await new Promise( r => setTimeout(r, 100*count*u()) )
                if ( u() < 1-1/(1+.05*Math.sqrt(count)) ) {
                    await lowerEyes();
                    await new Promise( r => setTimeout(r, 300) )
                    await raiseEyes();
                    await new Promise( r => setTimeout(r, 300) )
                    await lowerEyes();
                    await new Promise( r => setTimeout(r, 300) )
                    await raiseEyes();
                    await new Promise( r => setTimeout(r, 1e3+5e2*Math.sqrt(count)*u()) )
                    await lowerEyes();
                }
    
                // paw flips back slider
                if (count > 0 && u() < .15) {

                    // hesitate
                    await raiseEyes();
                    let [ T, dt ] = [ 400, 10 ];
                    steps = Math.floor(T/dt);
                    for (let t = 0; t < steps; t++) {
                        pawState = transition(t,steps,'sin');
                        mainWrapper.buttonState = 1-.2*pawState;
                        await new Promise( r => setTimeout(r, dt) )
                    }
                    await new Promise( r => setTimeout(r, 1e3+u()*2e3) )
                    await lowerEyes();
                    [ T, dt ] = [ 200, 10 ];
                    steps = Math.floor(T/dt);
                    for (let t = 0; t < steps; t++) {
                        let val = transition(t,steps,'sin');
                        pawState = 1-val;
                        mainWrapper.buttonState = .8+.2*val;
                        await new Promise( r => setTimeout(r, dt) )
                    }
                    await new Promise( r => setTimeout(r, 5e2) )

                } 

                flipAnimate();
                [ T, dt ] = [ 140, 10 ];
                steps = Math.floor(T/dt);
                for (let t = 0; t < steps; t++) {
                    pawState = transition(t,steps,'sigmoid')
                    await new Promise( r => setTimeout(r, dt) )
                }

                // return paw
                [ T, dt ] = [ 140, 10 ];
                steps = Math.floor(T/dt);
                for (let t = 0; t < steps; t++) {
                    pawState = 1-transition(t,steps,'sigmoid')
                    await new Promise( r => setTimeout(r, dt) )
                }
    
                // raise eyes
                await raiseEyes();

                // meow at some times
                if (count > 0 && u() < .2) {

                    
                    phrase = phrases[Math.floor(u()*phrases.length)];

                    await new Promise( r => setTimeout(r, 50) )
                    meow.play()
                    [ T, dt ] = [ 140, 10 ];
                    steps = Math.floor(T/dt);
                    for (let t = 0; t < steps; t++) {
                        speechBubbleOpacity = transition(t,steps,'sigmoid')
                        await new Promise( r => setTimeout(r, dt) )
                    }

                    await new Promise( r => setTimeout(r, 1000) )

                    steps = Math.floor(T/dt);
                    for (let t = 0; t < steps; t++) {
                        speechBubbleOpacity = 1-transition(t,steps,'sigmoid')
                        await new Promise( r => setTimeout(r, dt) )
                    }

                    speechBubbleOpacity = 0;
                }

                // raise count
                count += 1

            }

            await new Promise( r => setTimeout(r, u()*1000) )

            
        }
        
    }



    // -- init --
    canvas.addEventListener('click', function(event) {
        var x = event.pageX - event.target.offsetLeft,
            y = event.pageY - event.target.offsetTop;
        if (!mainWrapper.buttonState
            && y > .4*h && y < .6*h 
            && x > (.5-.2)*w && x < (.5-.2)*w + (2*.2)*w) {   
                flipAnimate()
        }
    }, false);
    render()

    // instantiate backend processes
    blinkRandomly()
    moveTail()
    reject()

})();