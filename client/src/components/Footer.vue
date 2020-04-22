<template>
<div class="footer">
      <div class="zoom">
        <a href="http://www.inrae.fr" target="_blank" class="btn-floating btn-sm btn-fb mx-1"><i><img src="https://www.commodafrica.com/sites/commodafrica.com/files/inrae.png" class="icone" target="_blank"></i></a>
        <a href= "https://www.hdigitag.fr/fr/ " target="_blank" class="btn-floating btn-sm btn-fb mx-1" ><i><img src="https://www.hdigitag.fr/wp-content/uploads/cropped-logoDigitAg-perim.png" class="icone" ></i></a>
        <a href= "https://muse.edu.umontpellier.fr/" target="_blank" class="btn-floating btn-sm btn-fb mx-1"><i><img src='https://www.montpellier.archi.fr/wp-content/uploads/2019/02/Logo_MUSE_Original.png' class="icone"  ></i></a>
      </div>
      <div class="copyright " >
         &copy; 2020 Copyright: <a href="https://www.inrae.fr/centres/occitanie-montpellier" target="_blank">  INRAE OCCITANIE MONTPELLIER</a>
      </div>
</div>
</template>

<script>

  
  export default {
    name: 'Footer',
    components: {
    }
  }
</script>

<style scoped>

.zoom p {
text-align:center;
}
.zoom img {
max-width: 5%;
	height: auto;
}
.zoom img:hover {
max-width: 12%;
	height: auto;
}

img {
  border-radius: 10%;
}
.icone{
	max-width: 10%;
	height: auto;
}

.zoom{background: gray;padding: 15px}
.copyright{background: black; padding: 15px;
  text-align: center;
  color: white;}
</style>