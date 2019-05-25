import React from 'react';
import { TextFieldProps } from "@material-ui/core/TextField";
import { TextField } from "@material-ui/core";
import { isCashStringValid } from "../../../utils/isCashStringValid";

const CashInput: React.FC<TextFieldProps> = ({ onChange: onChangeProp, ...restProps }) => {
  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChangeProp) {
        return;
      }

      if (!isCashStringValid(event.target.value)) {
        return;
      }

      onChangeProp(event);
    },
    [onChangeProp],
  );

  return (
    <TextField {...restProps} onChange={onChange}/>
  );
};
export default CashInput;
