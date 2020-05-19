import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function RoundedSquare(props: any) {
  return (
    <Svg viewBox="0 0 26.458 26.458" {...props}>
      <Path
        d="M15.474 8.408c-3.221.014-6.444-.001-9.665.031-1.836.09-3.726 1.226-4.184 3.095-.35 1.387-.155 2.828-.197 4.243.024 2.358-.008 4.719.052 7.076.134 1.78 1.285 3.561 3.088 4.005 1.508.367 3.077.162 4.613.228 2.274-.013 4.552.052 6.823-.033 1.73-.153 3.453-1.273 3.885-3.027.356-1.437.156-2.932.215-4.396-.014-2.393.05-4.789-.02-7.18-.082-1.67-1.226-3.212-2.83-3.715a5.648 5.648 0 00-1.78-.327z"
        strokeWidth={0.188}
        strokeLinejoin="round"
        transform="matrix(1.4 0 0 1.40004 -1.848 -11.624)"
      />
    </Svg>
  );
}

export default RoundedSquare;
