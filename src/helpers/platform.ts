export const isMobile = () => {
    alert(navigator.userAgent)
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent) //|| window.matchMedia("only screen and (max-width: 760px)").matches
}