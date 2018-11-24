import React, {Component} from 'react';

// Webpack async require?
// var wasm = __webpack_require__.e(/*! import() */ 0)
// .then(__webpack_require__.bind(null, /*! ./fractal.wasm */ "./src/fractal.wasm"));
const wasm = import('./fractal.wasm');

// Use wasm implementation?
const useWasm = true;

class Canvas extends Component {

  /** constructor ** {{{
   */
  constructor(props) {
    super(props);

    this.state = {
    };
  }/*}}}*/

  /** mandelIterJS ** {{{ JS implementation
   * @param {int} x
   * @param {int} y
   * @param {int} maxIter
   * @return {int} Lightness value for HSL color
   * @see [Colors HSL](https://www.w3schools.com/colors/colors_hsl.asp)
   */
  mandelIterJS(x, y, maxIter) {
    let r = x;
    let i = y;
    for (let a = 0; a < maxIter; a++) {
      let tmpr = r * r - i * i + x;
      let tmpi = 2 * r * i + y;

      r = tmpr;
      i = tmpi;

      if (r * i > 5) {
        return a/maxIter * 100;
      }
    }

    return 0;
  }/*}}}*/

  /** drawFractal ** {{{
   * @param {Function} mandelIter - Fractal drawing callback
   */
  drawFractal(mandelIter) {
    const canvas = this.refs.canvas.getContext('2d');
    const mag = 200;
    const panX = 2;
    const panY = 1.25;
    const maxIter = 100;

    for (let x = 10; x < this.props.height; x++)  {
      for (let y = 10; y < this.props.width; y++)  {
        const xVal = x/mag - panX;
        const yVal = y/mag - panY;
        const m = mandelIter(xVal, yVal, maxIter);
        canvas.fillStyle = (m === 0) ? '#000' : 'hsl(0, 100%, ' + m + '%)';
        canvas.fillRect(x, y, 1,1);
      }
    }
  }/*}}}*/

  /** startTimer ** {{{
   */
  startTimer() {
    this.startTime = Date.now();
  }/*}}}*/

  /** endTimer ** {{{
   */
  endTimer() {
    this.endTime = Date.now();
    const elapsedTime = this.endTime - this.startTime;
    this.setState({ elapsedTime });
    console.log('Elapsed time:', elapsedTime);
  }/*}}}*/

  /** componentDidMount ** {{{
   */
  componentDidMount() {
    this.startTimer();
    if (useWasm) {
      wasm
        .then(wasm => {
          const mandelIterWASM = wasm._Z10mandelIterffi;
          this.drawFractal(mandelIterWASM);
        })
        .then(() => this.endTimer())
      ;
    }
    else {
      this.drawFractal(this.mandelIterJS.bind(this));
      this.endTimer();
    }
  }/*}}}*/

  /** render ** {{{
   */
  render() {
    const {elapsedTime} = this.state;
    return (
      <React.Fragment>
        <canvas ref="canvas"  width={this.props.width} height={this.props.height}/>
        <div className="info">
          <div className="useWasm">
            <label>Use WASM:</label> <span>{useWasm ? 'yes' : 'no'}</span>
          </div>
          <div className="elapsedTime">
            <label>Elapsed time:</label> <span>{elapsedTime} ms</span>
          </div>
        </div>
      </React.Fragment>
    )
  }/*}}}*/

}

export default Canvas;
