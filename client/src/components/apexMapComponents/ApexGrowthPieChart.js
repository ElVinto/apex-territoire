import { Pie, mixins } from 'vue-chartjs'

export default {

    extends: Pie,

    mixins: [mixins.reactiveData],

    name: "ApexGrowthPieChart",

    data(){
        return{

            chartData: {
                labels: ["% Pleine croissance   ", "% Croissance ralentie", "% Croissance arrétée"],
                datasets: [{
                    data: [0,0,0],
                    label: "croissance des apex",
                    backgroundColor: [
                        '#2C6109',
                        '#6E9624',
                        '#C5DC68'
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },

            chartNoData: {
                labels: ["pas d'observations"],
                datasets: [{
                    data: [-1],
                    label: "croissance des apex",
                    backgroundColor: [
                        '#cccccc'
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },


            options: {
                animation: {
                    duration: 0
                },
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom',
                    onClick: (e) => e.stopPropagation()
                }
            }
        }
    },

    
    computed: {
        
        selectedWeekPieData :{
            get(){

                if(this.$store.state.userDataObj === null){

                    console.log("CALL selectedPieData ");
                    console.log([0,0,0]);

                    return [0,0,0];
                }

                let week_metric = this.$store.getters.getSelectedWeekMetric;
                let nbObsFullGrowth = parseInt(week_metric.nbObsFullGrowth);
                let nbObsSlowGrowth = parseInt(week_metric.nbObsSlowGrowth);
                let nbObsStoppedGrowth = parseInt(week_metric.nbObsStoppedGrowth);

                let prctFullGrowth = 0
                let prctSlowGrowth = 0
                let prctStoppedGrowth = 0

                let nbTotalObs = nbObsFullGrowth+nbObsSlowGrowth+nbObsStoppedGrowth;

                if(nbTotalObs>0){
                    prctFullGrowth = Math.round((nbObsFullGrowth / nbTotalObs) * 100)
                    prctSlowGrowth = Math.round((nbObsSlowGrowth / nbTotalObs) * 100)
                    prctStoppedGrowth = Math.round((nbObsStoppedGrowth / nbTotalObs) * 100)
                }

                console.log("CALL selectedPieData ");
                console.log([prctFullGrowth,prctSlowGrowth,prctStoppedGrowth]);

                return [prctFullGrowth,prctSlowGrowth,prctStoppedGrowth];
            }
        }
    },

    watch: {
        selectedWeekPieData(newVal){
            console.log("WATCH selectedPieData ");
            console.log(newVal);
            if(this.$store.getters.getSelectedWeekMetricTotalNbObs>0){
                this.chartData.datasets[0].data = newVal;
                this.renderChart(this.chartData,this.options)
            }else{
                this.renderChart(this.chartNoData,this.options)
            }
        },
    },    
}

