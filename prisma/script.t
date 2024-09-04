http://localhost:9000/auth/role

{
    "name":"Administrator",
    "description":"the adimin can create new user",
    "jobRole":"Administrator",
    "orgId":1,
    "subject":"all",
    "action":["manage"]
    }


  {
"name":"Gust",
"description":"the Gust can read doc",
"jobRole":"Gust",
"orgId":1,
"subject":"Gust",
"action":["read"]
}  

{
"name":"User",
"description":"the User can read doc",
"jobRole":"User",
"orgId":1,
"subject":"User",
"action":["manage"]
}
    

    http://localhost:9000/auth/register


    {
"title":"In-House Solution Development",
"name":"yonas mulugeta",
"empId":"16033",
"email":"yonas.mulugetat@ethiotelecom.et",
"password":"Test@123",
"roleId":1

}