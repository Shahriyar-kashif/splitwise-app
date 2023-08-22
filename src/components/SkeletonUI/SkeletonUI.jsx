import { Box, Skeleton } from "@mui/material";

export default function SkeletonUI() {
    return (
      <Box sx={{width:'100%'}}>
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Box>
    );
  }
