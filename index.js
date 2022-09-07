const { response } = require("express");
const express = require("express");

const app = express();

// 解决跨域问题
// const cors = require('cors')
// app.use(cors())
app.all("*", (request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With");
  response.header("Access-Control-Allow-Headers", ["mytoken, Content-type"]);
  next();
});

// 配置解析表单数据中间件，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({ extends: false }));

// 校验登录信息
app.get("/login", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("1数据库连接成功!");
  });

  var name = req.query.name;
  var password = req.query.password;
  var message = "";
  var sql = `select * from users where name = "${name}"`;
  //用户密码查询
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("用户密码登录查询错误 ----- ", err.message);
      return;
    }
    if (!result.length) {
      message = "用户不存在！";
    } else if (result[0].password !== password) {
      message = "密码错误！";
    } else {
      message = "登录成功！";
    }
    // console.log(result[0].password)
    console.log("查询验证信息 ----- name:", name, ", password:", password);
    console.log("查询结果 ----- ", result);
    res.send(message);
  });
  // 断开mysql连接
  connection.end();
});

// 学生管理，获取学生信息表
app.get("/home/student", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("2数据库连接成功!");
  });

  var sql = "select * from student";
  //学生信息表查询
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("学生信息表获取失败 ----- ", err.message);
      return;
    }
    if (!result.length) {
      message = "空学生信息表";
    } else {
      message = "获取成功";
    }
    res.send(result);
  });
  // 断开mysql连接
  connection.end();
});

// 编辑学生信息
app.get("/home/student/update", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("5数据库连接成功!");
  });

  var params = Object.values(req.query);
  // var sql1 = `select * from student where Sno = "${params[0]}"`;
  var sql = `update student set Sname = "${params[1]}",Ssex = "${params[2]}",Sage = ${params[3]},Sclass = "${params[4]}",Stelephone = "${params[5]}",Sremarks = "${params[6]}" where Sno = "${params[0]}"`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("保存失败----", err.message);
      return;
    }
    console.log("保存成功");
    res.send("保存成功");
  });
  connection.end();
});

// 删除学生信息
app.get("/home/student/delete", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("3数据库连接成功!");
  });

  var sno = req.query.sno;
  var sql = `delete from student where Sno = "${sno}"`;

  //删除学生信息
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("学生信息删除失败 ----- ", err.message);
      return;
    }
    message = "删除成功";
    console.log("Sno =", sno, message);
    res.send();
  });
  // 断开mysql连接
  connection.end();
});

// 添加学生信息
app.get("/home/student/insert", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("4数据库连接成功!");
  });

  var message = "";
  var params = Object.values(req.query);
  var sql1 = `select * from student where Sno = "${params[0]}"`;
  var sql2 = "insert into student values(?,?,?,?,?,?,?)";

  // 检验是否存在相同学籍编号
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log("学籍编号查询失败 ----- ", err.message);
      return;
    }
    if (!result.length) {
      // console.log("无相同学号")
      connection.query(sql2, params, function (err, result) {
        if (err) {
          console.log("学生添加失败 ----- ", err.message);
          return;
        }
        console.log("添加成功");
        res.send("添加成功");
      });
    } else {
      console.log("添加失败，该学籍编号已存在！");
      res.send("添加失败，该学籍编号已存在！");
    }
    connection.end();
  });
});

// 课程管理，获取课程信息表
app.get("/home/course", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("课程表--数据库连接成功!");
  });

  var sql = "select * from course";
  //学生信息表查询
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("课程信息表获取失败 ----- ", err.message);
      return;
    }
    if (!result.length) {
      message = "空课程信息表";
    } else {
      message = "获取成功";
    }
    res.send(result);
  });
  // 断开mysql连接
  connection.end();
});

// 编辑课程信息
app.get("/home/course/update", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("课程编辑--数据库连接成功!");
  });

  var params = Object.values(req.query);
  var sql = `update course set Cname = "${params[1]}",Credit = ${params[2]},Cteacher = "${params[3]}",Cremarks = "${params[4]}" where Cno = "${params[0]}"`;
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("保存失败----", err.message);
      return;
    }
    console.log("保存成功");
    res.send("保存成功");
  });
  connection.end();
});

// 删除课程信息
app.get("/home/course/delete", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("课程删除--数据库连接成功!");
  });

  var cno = req.query.cno;
  var sql = `delete from course where Cno = "${cno}"`;

  //删除学生信息
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("课程信息删除失败 ----- ", err.message);
      return;
    }
    message = "删除成功";
    res.send();
  });
  // 断开mysql连接
  connection.end();
});

// 添加课程信息
app.get("/home/course/insert", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("添加课程--数据库连接成功!");
  });
  var params = Object.values(req.query);
  var sql1 = `select * from course where Cno = "${params[0]}"`;
  var sql2 = "insert into course values(?,?,?,?,?)";
  console.log(params);

  // 检验是否存在相同课程号
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log("课程号查询失败 ----- ", err.message);
      return;
    }
    if (!result.length) {
      // console.log("无相同课程号")
      connection.query(sql2, params, function (err, result) {
        if (err) {
          console.log("课程添加失败 ----- ", err.message);
          return;
        }
        console.log("添加成功");
        res.send("添加成功");
      });
    } else {
      console.log("添加失败，该课程号已存在！");
      res.send("添加失败，该课程号已存在！");
    }
    connection.end();
  });
});

// 成绩管理，获取成绩表
app.get("/home/grade", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("成绩表--数据库连接成功!");
  });

  var sql = "select * from student_course_grade order by cno";
  //成绩表查询
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("成绩表获取失败 ----- ", err.message);
      return;
    }
    if (!result.length) {
      message = "空成绩表";
    } else {
      message = "获取成功";
    }
    res.send(result);
  });
  // 断开mysql连接
  connection.end();
});

// 编辑课程成绩
app.get("/home/grade/update", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("成绩编辑--数据库连接成功!");
  });

  var params = Object.values(req.query);
  var sql = `update grade set Grade = ${params[2]},Gremarks = "${params[3]}" where Cno = "${params[0]}" and Sno = "${params[1]}"`;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("保存失败----", err.message);
      return;
    }
    console.log("保存成功");
    res.send("保存成功");
  });
  connection.end();
});

// 删除课程成绩信息
app.get("/home/grade/delete", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("成绩删除--数据库连接成功!");
  });

  var cno = req.query.cno;
  var sno = req.query.sno;
  var sql = `delete from grade where Cno = "${cno}" and Sno = "${sno}"`;

  //删除课程成绩
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("课程成绩删除失败 ----- ", err.message);
      return;
    }
    message = "删除成功";
    res.send();
  });
  // 断开mysql连接
  connection.end();
});

// 添加课程成绩信息
app.get("/home/grade/insert", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("添加成绩--数据库连接成功!");
  });
  var params = Object.values(req.query);
  var sql1 = `select * from course where Cno = "${params[0]}"`;
  var sql2 = `select * from student where Sno = "${params[1]}"`;
  var sql3 = `select * from grade where Cno = "${params[0]}" and Sno = "${params[1]}"`;
  var sql4 = "insert into grade values(?,?,?,?)";

  // 检验是否是已经存在的课程号
  connection.query(sql1, function (err, result) {
    if (err) {
      console.log("课程号查询失败 ----- ", err.message);
      return;
    }
    if (result.length) {
      connection.query(sql2, function (err, result) {
        if (err) {
          console.log("学号查询失败 ----- ", err.message);
          return;
        }
        if (result.length) {
          connection.query(sql3, function (err, result) {
            if (err) {
              console.log("成绩查询失败 ----- ", err.message);
              return;
            }
            if (result.length) {
                console.log("成绩添加失败，该课程，该名学生已有成绩！");
                res.send("成绩添加失败，该课程，该名学生已有成绩！");
            } else {
              connection.query(sql4, params, function (err, result) {
                if (err) {
                  console.log("成绩添加失败 ----- ", err.message);
                  return;
                }
                console.log("成绩添加成功");
                res.send("添加成功");               
              });
            }
            connection.end()
            console.log("关闭数据库连接")
          });
        } else {
          console.log("添加失败，并无该名学生！");
          res.send("添加失败，并无该名学生！");
        }
      });
    } else {
      console.log("添加失败，并无该项课程！");
      res.send("添加失败，并无该项课程！");
    }
  });
});

// 获取各班各科平均分
app.get("/home/chart", (req, res) => {
  // 导入mysql
  const mysql = require("mysql");
  // 创建mysql连接信息
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "student_system",
  });
  // 连接mysql
  connection.connect((err) => {
    if (err) throw err;
    console.log("图表---数据库连接成功!");
  });

  var sql = "select class,cname,round(AVG(grade),2) as avgGrade from student_course_grade group by class,cno";
  //学生信息表查询
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("各班各科平均分获取失败 ----- ", err.message);
      return;
    }
    if (!result.length) {
      message = "空表";
    } else {
      message = "获取成功";
    }
    res.send(result);
  });
  // 断开mysql连接
  connection.end();
});

// 启动服务器
app.listen(5000, () => {
  console.log("server running at http://127.0.0.1:5000");
});
