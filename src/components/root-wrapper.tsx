import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Stack,
} from "@suid/material"
import { Breakpoint, createTheme, Theme, ThemeProvider } from "@suid/material/styles"
import { Outlet, Link } from "@solidjs/router"
import { For, JSX } from "solid-js"
import { useNdnWorkspace } from "../Context"
import { Portal } from "solid-js/web"

const drawerWidth = 200

function RouteItem(props: { icon: JSX.Element, title: string, href: string }) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={props.href}>
        <ListItemIcon>
          {props.icon}
        </ListItemIcon>
        <ListItemText primary={props.title} />
      </ListItemButton>
    </ListItem>
  )
}

const ColorVariables = (props: { theme: Theme<Breakpoint> }) => <style>{`
:root {
  --md-sys-color-primary: ${props.theme.palette.primary.main};
  --md-sys-color-on-primary: ${props.theme.palette.primary.contrastText};
  --md-sys-color-primary-container: ${props.theme.palette.primary.light};
  --md-sys-color-on-primary-container: ${props.theme.palette.primary.contrastText};
  --md-sys-color-secondary: ${props.theme.palette.secondary.main};
  --md-sys-color-on-secondary: ${props.theme.palette.secondary.contrastText};
  --md-sys-color-secondary-container: ${props.theme.palette.secondary.light};
  --md-sys-color-on-secondary-container: ${props.theme.palette.secondary.contrastText};
  --md-sys-color-tertiary: ${props.theme.palette.info.main};
  --md-sys-color-on-tertiary: ${props.theme.palette.info.contrastText};
  --md-sys-color-tertiary-container: ${props.theme.palette.info.light};
  --md-sys-color-on-tertiary-container: ${props.theme.palette.info.contrastText};
  --md-sys-color-error: ${props.theme.palette.error.main};
  --md-sys-color-on-error: ${props.theme.palette.error.contrastText};
  --md-sys-color-error-container: ${props.theme.palette.error.light};
  --md-sys-color-on-error-container: ${props.theme.palette.error.contrastText};
  --md-sys-color-background: ${props.theme.palette.background.default};
  --md-sys-color-on-background: ${props.theme.palette.text.primary};
  --md-sys-color-surface: ${props.theme.palette.background.paper};
  --md-sys-color-on-surface: ${props.theme.palette.text.primary};
  --md-sys-color-shadow: ${props.theme.palette.primary.main};
  --md-elevation-level: ${0};
  --theme-color-success: ${props.theme.palette.success.main};
  --theme-color-success-container: ${props.theme.palette.success.light};
  --theme-color-grey-600: ${props.theme.palette.grey[600]};
}
`}</style>

export default function Root(props: {
  routes: Array<{ icon: JSX.Element, title: string, href: string }>
}) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode() ? "dark" : "light"
    },
  })
  const { setTheme } = useNdnWorkspace()!
  setTheme(theme)

  // TODO: MUI's Tab may be better?
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Portal mount={document.getElementsByTagName("head")[0]}>
        <ColorVariables theme={theme} />
      </Portal>
      <div>
        {/* The left navigation bar. Breakpoint: 0 <= xs <= 600px, 600px < sm  */}
        <Box sx={{ display: 'flex' }}>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth, xs: 0 }, flexShrink: 0 }}
            aria-label="navibar"
          >
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                },
                display: { sm: 'block', xs: 'none' },
              }}
              variant="permanent"
              anchor="left"
            >
              <List>
                <For each={props.routes}>{item =>
                  <RouteItem icon={item.icon} href={item.href} title={item.title} />
                }</For>
              </List>
            </Drawer>
          </Box>

          {/* The body */}
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, minHeight: '100vh', overflowX: 'hidden' }}
          >
            <Outlet />
          </Box>

          {/* The bottom navigation bar */}
          <Paper
            elevation={3}
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          >
            <BottomNavigation
              showLabels
              sx={{
                display: { sm: 'none', xs: 'flex' },
                width: "100%",
              }}
              component={Stack}
              direction="row"
              justifyContent="center"
            >
              <For each={props.routes}>{item =>
                <BottomNavigationAction component={Link} icon={item.icon} href={item.href} label={item.title} />
              }</For>
            </BottomNavigation>
          </Paper>
        </Box>
      </div>
    </ThemeProvider>
  )
}