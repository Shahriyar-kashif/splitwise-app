import { Box, Button, Typography } from "@mui/material";

export default function AppIntro() {
    return (
        <Box sx={{width:2/4, ml:'10%', p:5, mt:15}}>
            <Typography variant="h4" sx={{mb:5}}>
              <span style={{color:'#673ab7', fontWeight:'bold'}}>Share Expenses</span> with Ease and Clarity.
            </Typography>
            <Typography variant="body1" paragraph sx={{fontSize:'150%', mb:4}}>
                Effortlessly manage shared expenses and financial balances
                with your housemates, travel companions, groups, friends,
                and family members. Keep financial transactions transparent
                and organized, ensuring a stress-free experience for all.
            </Typography>
            <Button variant="contained" sx={{px:5, py:2}}>Sign up</Button>
        </Box>
    )
}
