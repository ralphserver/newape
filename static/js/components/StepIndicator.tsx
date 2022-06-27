import styled from "@emotion/styled";

export const StepCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #4a5766;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 -12px;
  &:not(:first-child) {
    margin: 0 -12px 0 0;
  }
`;

export const StepLine = styled.div`
  height: 1px;
  flex-grow: 1;
  background-color: #4a5766;
`;
