const txtObsv = document.querySelectorAll("h2, h1, h3,h4, p,td,img,iframe,.achievements-text-container,body")
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("cssAnims", entry.isIntersecting)
        if (entry.isIntersecting) observer.unobserve(entry.target)


    })

})
txtObsv.forEach(txtObsvr => {
    observer.observe(txtObsvr)
})