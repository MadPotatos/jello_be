// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all entries in the tables
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE TABLE Notification;`;
  await prisma.$executeRaw`TRUNCATE TABLE Comment;`;
  await prisma.$executeRaw`TRUNCATE TABLE Assignee;`;
  await prisma.$executeRaw`TRUNCATE TABLE Issue;`;
  await prisma.$executeRaw`TRUNCATE TABLE Sprint;`;
  await prisma.$executeRaw`TRUNCATE TABLE List;`;
  await prisma.$executeRaw`TRUNCATE TABLE Member;`;
  await prisma.$executeRaw`TRUNCATE TABLE Project;`;
  await prisma.$executeRaw`TRUNCATE TABLE User;`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;

  // Insert data into User table,password is 'password123'
  await prisma.$executeRaw`
    INSERT INTO User (email, name, password, avatar, job, organization, createdAt, updatedAt)
    VALUES
      ('viet@example.com', 'Nguyễn Tiến Việt', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716905683/fimorf8emgqfylm9ltwl.jpg', 'Backend Developer', 'HUST', NOW(), NOW()),
      ('vanh@example.com', 'Nguyễn Việt Anh', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906054/gxybh9wnhdww5v2p0hwc.jpg', 'Backend Developer', 'HUST', NOW(), NOW()),
      ('kien@example.com', 'Nguyễn Trung Kiên', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906054/b2yc2zxnf2ojoy6pk3du.jpg', 'DevOps', 'HUST', NOW(), NOW()),
      ('dung@example.com', 'Lê Anh Dũng', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906055/qg7qx2wd1gaz4fswfigw.jpg', 'Frontend Developer', 'HUST', NOW(), NOW()),
      ('hieu@example.com', 'Ngô Trung Hiếu', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906055/ekizag00gjminjtcupsd.jpg', 'Tester', 'HUST', NOW(), NOW()),
      ('david@example.com', 'David Smith', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906060/vc8bnv6lcxpfwdme26h5.jpg', 'Software Developer', 'FPT Software', NOW(), NOW()),
      ('eve@example.com', 'Eve', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906316/xjgknlp1u0wny9dycdti.jpg', 'Tester', 'FPT Software', NOW(), NOW()),
      ('frank@example.com', 'Frank Castle', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906331/ccgui0bjpox5g7pmrij7.jpg', 'Backend Developer', 'FPT Software', NOW(), NOW()),
      ('grace@example.com', 'Grace', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906316/cy6bsbchnnic6vlfp2gi.jpg', 'Designer', 'FPT Software', NOW(), NOW()),
      ('heidi@example.com', 'Heidi', '$2b$10$9VbD9AGQmPuE6V.tYsBRO.h7iMkoXSwihMFCcp/KDNGPJWGXzC.gC', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716906316/hxg110olgbduwqkzap4z.jpg', 'Frontend Developer', 'FPT Software', NOW(), NOW());
  `;

  // Insert data into Project table
  await prisma.$executeRaw`
    INSERT INTO Project (name, descr, repo, image, createdAt, updatedAt, userId, isDeleted)
    VALUES
      ('Project Jello', 'A project management website with NextJs, NestJs, Prisma, MySQL', 'https://github.com/MadPotatos/jello_fe', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716907191/l4vl7anbuiqcfipkzwi2.png', NOW(), NOW(), 1, false),
      ('Hustnet', 'HustNet, mạng xã hội dành riêng cho sinh viên Hust. Nơi sinh viên có thể trao đổi học tập, tìm và kết bạn dựa trên lớp và lịch học.Project sử dụng frontend React + Vite cùng với backend NestJs', 'https://github.com/yamadaOliva/TenTsuh', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716907974/lxivuohqurzfcqlfnfwq.png', NOW(), NOW(), 1, false),
      ('Project E-commerce', 'Web E-commerce giúp xử lý 1.000.000 request cùng 1 lúc', 'https://github.com/kien2572001/ecommerce-fe', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716908191/n8hqlojlndspe0ifusi0.jpg', NOW(), NOW(), 3, false),
      ('BruhQuest, Java RPG game', 'Game 2D BruhQuest thuộc thể loại Top-down RPG được viết bằng Java swing cùng với thư viện đồ họa AWT ', 'https://github.com/MadPotatos/BruhQuest', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716909563/qbghcbardkpkvvjvcr1u.jpg', NOW(), NOW(), 1, false),
      ('TC', 'Restaurant recommend website. Web helps Japanese people living in Hanoi find good and cheap restaurants in Hanoi', 'https://github.com/MadPotatos/Project_LTW', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716909574/zb7u0danxgowimgtmwp8.jpg', NOW(), NOW(), 2, false),
      ('Flight Tracker', 'Python project that track current flights', 'https://github.com/skylines-project/skylines', 'https://res.cloudinary.com/dneewzs4b/image/upload/v1716909563/os0dfdp41695i0nbxwm2.jpg', NOW(), NOW(), 6, false);
  `;

  // Insert data into Member table
  await prisma.$executeRaw`
    INSERT INTO Member (isAdmin, createdAt, projectId, userId)
    VALUES
      (true, NOW(), 1, 1),
      (false, NOW(), 1, 2),
      (false, NOW(), 1, 3),
      (false, NOW(), 1, 4),
      (false, NOW(), 1, 5),
      (false, NOW(), 1, 6),
      (false, NOW(), 1, 7),
      (false, NOW(), 1, 8),
      (false, NOW(), 1, 9),
      (false, NOW(), 1, 10),
      (true, NOW(), 2, 1),
      (false, NOW(), 2, 3),
      (false, NOW(), 2, 4),
      (false, NOW(), 2, 5),
      (false, NOW(), 2, 2),
      (true, NOW(), 3, 3),
      (false, NOW(), 3, 1),
      (true, NOW(), 4, 1),
      (false, NOW(), 4, 4),
      (true, NOW(), 5, 7),
      (false, NOW(), 5, 8),
      (true, NOW(), 6, 9),
      (false, NOW(), 5, 1),
      (true, NOW(), 6, 6),
      (false, NOW(), 6, 7),
      (false, NOW(), 6, 1);
  `;

  // Insert data into List table
  await prisma.$executeRaw`
    INSERT INTO List (name, \`order\`, createdAt, updatedAt, projectId)
    VALUES
      ('To Do', 1, NOW(), NOW(), 1),
      ('In Progress', 2, NOW(), NOW(), 1),
      ('Done', 3, NOW(), NOW(), 1),
      ('Cần làm', 1, NOW(), NOW(), 2),
      ('Đang tiến hành', 2, NOW(), NOW(), 2),
      ('Đã hoàn thành', 3, NOW(), NOW(), 2),
       ('Cần làm', 1, NOW(), NOW(), 3),
      ('Đang tiến hành', 2, NOW(), NOW(), 3),
      ('Đã hoàn thành', 3, NOW(), NOW(), 3),
       ('Cần làm', 1, NOW(), NOW(), 4),
      ('Đang tiến hành', 2, NOW(), NOW(), 4),
      ('Đã hoàn thành', 3, NOW(), NOW(), 4),
      ('To Do', 1, NOW(), NOW(), 5),
      ('In Progress', 2, NOW(), NOW(), 5),
      ('Done', 3, NOW(), NOW(), 5),
      ('To Do', 1, NOW(), NOW(), 6),
      ('In Progress', 2, NOW(), NOW(), 6),
      ('Done', 3, NOW(), NOW(), 6);
  `;

  // Insert data into Sprint table
  await prisma.$executeRaw`
    INSERT INTO Sprint (name, \`order\`, startDate, endDate, goal, status, createdAt, updatedAt, projectId)
    VALUES
    -- Project 1 
    ('Backlog', 0, null, null, null, 'CREATED', NOW(), NOW(), 1),
    ('Sprint 1', 1, NOW() - INTERVAL 1 MONTH, NOW(), 'Set up Structure for the Project', 'CREATED', NOW(), NOW(), 1),
    ('Sprint 2', 2, NOW(), NOW() + INTERVAL 1 MONTH, 'Implement User Authentication', 'CREATED', NOW(), NOW(), 1),
    ('Sprint 3', 3, NOW() + INTERVAL 2 MONTH, NOW() + INTERVAL 3 MONTH, 'Implement basic CRUD API', 'CREATED', NOW(), NOW(), 1),
    ('Sprint 4', 4, NOW() + INTERVAL 3 MONTH, NOW() + INTERVAL 4 MONTH, 'Finalize UI Design', 'CREATED', NOW(), NOW(), 1),

    -- Project 2 
    ('Backlog', 0, null, null, null, 'CREATED', NOW(), NOW(), 2),
    ('Sprint 1', 1, NOW(), NOW() + INTERVAL 1 MONTH, 'Thiết lập cấu trúc dự án', 'CREATED', NOW(), NOW(), 2),
    ('Sprint 2', 2, NOW() + INTERVAL 1 MONTH, NOW() + INTERVAL 2 MONTH, 'Tạo chức năng đăng nhập', 'CREATED', NOW(), NOW(), 2),
    ('Sprint 3', 3, NOW() + INTERVAL 2 MONTH, NOW() + INTERVAL 3 MONTH, 'Phát triển trang quản lý người dùng', 'CREATED', NOW(), NOW(), 2),
    ('Sprint 4', 4, NOW() + INTERVAL 3 MONTH, NOW() + INTERVAL 4 MONTH, 'Tích hợp hệ thống thông báo', 'CREATED', NOW(), NOW(), 2),

    -- Project 3 
    ('Backlog', 0, null, null, null, 'CREATED', NOW(), NOW(), 3),
    ('Sprint 1', 1, NOW(), NOW() + INTERVAL 1 MONTH, 'Thiết lập môi trường phát triển', 'IN_PROGRESS', NOW(), NOW(), 3),
    ('Sprint 2', 2, NOW() + INTERVAL 1 MONTH, NOW() + INTERVAL 2 MONTH, 'Xây dựng API', 'CREATED', NOW(), NOW(), 3),
    ('Sprint 3', 3, NOW() + INTERVAL 2 MONTH, NOW() + INTERVAL 3 MONTH, 'Phát triển giao diện người dùng', 'CREATED', NOW(), NOW(), 3),
    ('Sprint 4', 4, NOW() + INTERVAL 3 MONTH, NOW() + INTERVAL 4 MONTH, 'Kiểm thử và sửa lỗi', 'CREATED', NOW(), NOW(), 3),

    -- Project 4 
    ('Backlog', 0, null, null, null, 'CREATED', NOW(), NOW(), 4),
    ('Sprint 1', 1, NOW(), NOW() + INTERVAL 1 MONTH, 'Thiết lập cấu trúc cơ bản', 'IN_PROGRESS', NOW(), NOW(), 4),
    ('Sprint 2', 2, NOW() + INTERVAL 1 MONTH, NOW() + INTERVAL 2 MONTH, 'Phát triển tính năng ', 'CREATED', NOW(), NOW(), 4),
    ('Sprint 3', 3, NOW() + INTERVAL 2 MONTH, NOW() + INTERVAL 3 MONTH, 'Tối ưu hóa hiệu suất', 'CREATED', NOW(), NOW(), 4),
    ('Sprint 4', 4, NOW() + INTERVAL 3 MONTH, NOW() + INTERVAL 4 MONTH, 'Đảm bảo an ninh', 'CREATED', NOW(), NOW(), 4),

    -- Project 5 
    ('Backlog', 0, null, null, null, 'CREATED', NOW(), NOW(), 5),
    ('Sprint 1', 1, NOW(), NOW() + INTERVAL 1 MONTH, 'Initial Setup and Configuration', 'IN_PROGRESS', NOW(), NOW(), 5),
    ('Sprint 2', 2, NOW() + INTERVAL 1 MONTH, NOW() + INTERVAL 2 MONTH, 'Build Main Application Features', 'CREATED', NOW(), NOW(), 5),

    -- Project 6 
    ('Backlog', 0, null, null, null, 'CREATED', NOW(), NOW(), 6),
    ('Sprint 1', 1, NOW(), NOW() + INTERVAL 1 MONTH, 'Define Project Scope', 'IN_PROGRESS', NOW(), NOW(), 6),
    ('Sprint 2', 2, NOW() + INTERVAL 1 MONTH, NOW() + INTERVAL 2 MONTH, 'Develop Core Modules', 'CREATED', NOW(), NOW(), 6);
  `;

  // Insert data into Issue table
  await prisma.$executeRaw`
    INSERT INTO Issue (listOrder, sprintOrder, priority, type, summary, descr, progress, dueDate, createdAt, updatedAt, listId, sprintId, projectId, reporterId, parentId)
    VALUES
    -- Project 1 
    (0, 0, 'HIGH', 'TASK', 'Set up NextJs', 'Set up NextJs for the project', 50, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 3, 2, 1, 1, null),
    (1, 1, 'HIGH', 'BUG', 'Create SQL schema', 'Create SQL schema for the project', 50, NOW() + INTERVAL 2 DAY, NOW(), NOW(), 3, 2, 1, 2, null),
    (2, 2, 'MEDIUM', 'REVIEW', 'Develop the homepage', 'Develop the homepage with a simple design', 100, NOW() + INTERVAL 3 DAY, NOW(), NOW(), 3, 2, 1, 3, null),
    (3, 3, 'HIGH', 'TASK', 'Set up NestJs', 'Set up NestJs for the project', 100, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 3, 2, 1, 4, null),
    (4, 4, 'MEDIUM', 'BUG', 'Fix the bug in the register page', 'The register page is not working properly', 100, NOW() + INTERVAL 5 DAY, NOW(), NOW(), 3, 2, 1, 5, null),
    (5, 5, 'MEDIUM', 'REVIEW', 'Develop the dashboard', 'Develop the dashboard with a simple design', 100, NOW() + INTERVAL 6 DAY, NOW(), NOW(), 3, 2, 1, 6, null),
    (0, 0, 'HIGH', 'TASK', 'Implement NextAuth', 'Implement NextAuth in frontend for the project', 50, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 2, 3, 1, 1, null),
    (1, 1, 'HIGH', 'TASK', 'Handle user authentication', 'Handle user authentication in the backend', 50, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 2, 3, 1, 1, null),
    (2, 2, 'MEDIUM', 'SUBISSUE', 'Test the login page', 'Test the login page with different scenarios',  50, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 2, 3, 1, 1, 8),
    (0, 3, 'MEDIUM', 'SUBISSUE', 'Test the register page', 'Test the register page with different scenarios', 0, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 1, 3, 1, 1, 8),
    (1, 4, 'MEDIUM', 'TASK', 'Develop the profile page', 'Develop the profile page with a simple design', 0, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 1, 3, 1, 1, null),
    (2, 5, 'MEDIUM', 'BUG', 'Fix the bug in the dashboard', 'The dashboard is not working properly', 0, NOW() + INTERVAL 5 DAY, NOW(), NOW(), 1, 3, 1, 1, null),
    (3, 0, 'MEDIUM', 'TASK', 'Write CRUD API for user', 'Write CRUD API for user in the backend', 0, null, NOW(), NOW(), 1, 4, 1, 1, null),
    (4, 1, 'MEDIUM', 'TASK', 'Write CRUD API for project', 'Write CRUD API for project in the backend', 0, null, NOW(), NOW(), 1, 4, 1, 1, null),
    (5, 2, 'MEDIUM', 'TASK', 'Write CRUD API for issue', 'Write CRUD API for issue in the backend', 0, null, NOW(), NOW(), 1, 4, 1, 1, null),
    (6, 3, 'MEDIUM', 'TASK', 'Write CRUD API for sprint', 'Write CRUD API for sprint in the backend', 0, null, NOW(), NOW(), 1, 4, 1, 1, null),
    (7, 4, 'MEDIUM', 'TASK', 'Write CRUD API for list', 'Write CRUD API for list in the backend', 0, null, NOW(), NOW(), 1, 4, 1, 1, null),
    (8, 5, 'MEDIUM', 'TASK', 'Write CRUD API for comment', 'Write CRUD API for comment in the backend', 0, null, NOW(), NOW(), 1, 4, 1, 1, null),
    (9, 0, 'MEDIUM', 'TASK', 'Write CRUD API for notification', 'Write CRUD API for notification in the backend', 0, null, NOW(), NOW(), 1, 5, 1, 1, null),
    (10, 1, 'MEDIUM', 'TASK', 'Write CRUD API for assignee', 'Write CRUD API for assignee in the backend', 0, null, NOW(), NOW(), 1, 5, 1, 1, null),
    (11, 2, 'MEDIUM', 'TASK', 'Write CRUD API for member', 'Write CRUD API for member in the backend', 0, null, NOW(), NOW(), 1, 5, 1, 1, null),
    (12, 3, 'MEDIUM', 'TASK', 'Write CRUD API for project', 'Write CRUD API for project in the backend', 0, null, NOW(), NOW(), 1, 5, 1, 1, null),
    (13, 4, 'MEDIUM', 'TASK', 'Write CRUD API for user', 'Write CRUD API for user in the backend', 0, null, NOW(), NOW(), 1, 5, 1, 1, null),


    -- Project 2
    (0,0, 'HIGH', 'REVIEW', 'Thiết lập luồng cho dự án, tạo các trang cần thiết', 'Thiết lập luồng cho dự án', 100, NOW(), NOW(), NOW(), 6, 7, 2, 2, null),
    (1,1,'HIGH','REVIEW', 'Thiết kế cơ sở dữ liệu', 'Thiết kế cơ sở dữ liệu cho dự án', 100, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 6, 7, 2, 2, null),  
    (0, 2, 'HIGH', 'TASK', 'Thiết lập môi trường', 'Thiết lập môi trường với NextJs', 50, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 5, 7, 2, 1, null),
    (1, 3, 'HIGH', 'TASK', 'Tạo cơ sở dữ liệu', 'Tạo cơ sở dữ liệu cho dự án', 50, NOW() + INTERVAL 2 DAY, NOW(), NOW(), 5, 7, 2, 3, null),
    (2, 4, 'HIGH', 'TASK', 'Phát triển trang chủ', 'Phát triển trang chủ với thiết kế đơn giản', 50, NOW() + INTERVAL 3 DAY, NOW(), NOW(), 5, 7, 2, 2, null),
    (3, 5, 'HIGH', 'TASK', 'Thiết lập NestJs', 'Thiết lập NestJs cho dự án', 50, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 5, 7, 2, 5, null),
    (4, 6, 'HIGH', 'TASK', 'Phát triển Dashboard', 'Phát triển Dashboard với thiết kế đơn giản', 50, NOW() + INTERVAL 6 DAY, NOW(), NOW(), 5, 7, 2, 4, null),
    (0, 0, 'HIGH', 'TASK', 'Thiết lập tính năng đăng nhập, đăng ký', 'Thiết lập tính năng đăng nhập, đăng ký cho dự án', 0, null, NOW(), NOW(), 4, 8, 2, 1, null),
    (1,1, 'MEDIUM', 'SUBISSUE', 'Kiểm thử trang đăng nhập', 'Kiểm thử trang đăng nhập với các trường hợp khác nhau', 0, null, NOW(), NOW(), 4, 8, 2, 1, 31),
    (2,2,'MEDIUM','SUBISSUE', 'Xác thực người dùng', 'Xác thực người dùng ở phía backend', 0, null, NOW(), NOW(), 4, 8, 2, 1, 31),
    (3,3,'MEDIUM','SUBISSUE', 'Thiết kế trang đăng nhập', 'Thiết kế trang đăng nhập với thiết kế đơn giản', 0, null, NOW(), NOW(), 4, 8, 2, 1, 31),
    (4,4,'MEDIUM','SUBISSUE', 'Thiết lập trang đăng ký', 'Thiết kế trang đăng ký với thiết kế đơn giản', 0, null, NOW(), NOW(), 4, 8, 2, 1, 31),


    -- Project 3
  (0, 0, 'HIGH', 'TASK', 'Thiết lập môi trường phát triển', 'Thiết lập môi trường phát triển', 100, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 7, 12, 3, 1, null),
  (1, 1, 'HIGH', 'BUG', 'Xây dựng API', 'Xây dựng API cho dự án', 100, NOW() + INTERVAL 2 DAY, NOW(), NOW(), 7, 12, 3, 1, null),
  (2, 2, 'MEDIUM', 'REVIEW', 'Phát triển giao diện người dùng', 'Phát triển giao diện người dùng', 100, NOW() + INTERVAL 3 DAY, NOW(), NOW(), 7, 12, 3, 1, null),
  (3, 3, 'HIGH', 'TASK', 'Kiểm thử và sửa lỗi', 'Kiểm thử và sửa lỗi', 100, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 7, 12, 3, 1, null),
  (4, 4, 'MEDIUM', 'BUG', 'Tạo trang giới thiệu', 'Tạo trang giới thiệu cho dự án', 100, NOW() + INTERVAL 5 DAY, NOW(), NOW(), 7, 12, 3, 1, null),
  (5, 5, 'MEDIUM', 'REVIEW', 'Tích hợp hệ thống thông báo', 'Tích hợp hệ thống thông báo', 100, NOW() + INTERVAL 6 DAY, NOW(), NOW(), 7, 12, 3, 1, null),

  -- Project 4
  (0, 0, 'HIGH', 'TASK', 'Thiết lập cấu trúc cơ bản', 'Thiết lập cấu trúc cơ bản', 100, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 10, 17, 4, 4, null),
  (1, 1, 'HIGH', 'BUG', 'Phát triển tính năng chính', 'Phát triển tính năng chính của dự án', 100, NOW() + INTERVAL 2 DAY, NOW(), NOW(), 10, 17, 4, 1, null),
  (2, 2, 'MEDIUM', 'REVIEW', 'Tối ưu hóa hiệu suất', 'Tối ưu hóa hiệu suất', 100, NOW() + INTERVAL 3 DAY, NOW(), NOW(), 10, 17, 4, 2, null),
  (3, 3, 'HIGH', 'TASK', 'Đảm bảo an ninh', 'Đảm bảo an ninh cho dự án', 100, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 10, 17, 4, 3, null),
  (4, 4, 'MEDIUM', 'BUG', 'Viết tài liệu hướng dẫn', 'Viết tài liệu hướng dẫn', 100, NOW() + INTERVAL 5 DAY, NOW(), NOW(), 10, 17, 4, 5, null),
  (5, 5, 'MEDIUM', 'REVIEW', 'Triển khai dự án', 'Triển khai dự án lên server', 100, NOW() + INTERVAL 6 DAY, NOW(), NOW(), 10, 17, 4, 6, null),

  -- Project 5
  (0, 0, 'HIGH', 'TASK', 'Initial Setup and Configuration', 'Initial Setup and Configuration', 100, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 13, 22, 5, 1, null),
  (1, 1, 'HIGH', 'BUG', 'Build Main Application Features', 'Build Main Application Features', 100, NOW() + INTERVAL 2 DAY, NOW(), NOW(), 13, 22, 5, 1, null),
  (2, 2, 'MEDIUM', 'REVIEW', 'Optimize Performance', 'Optimize Performance', 100, NOW() + INTERVAL 3 DAY, NOW(), NOW(), 13, 22, 5, 1, null),
  (3, 3, 'HIGH', 'TASK', 'Write User Documentation', 'Write User Documentation', 100, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 13, 22, 5, 1, null),
  (4, 4, 'MEDIUM', 'BUG', 'Deploy the Application', 'Deploy the Application', 100, NOW() + INTERVAL 5 DAY, NOW(), NOW(), 13, 22, 5, 1, null),
  (5, 5, 'MEDIUM', 'REVIEW', 'Test the Application', 'Test the Application', 100, NOW() + INTERVAL 6 DAY, NOW(), NOW(), 13, 22, 5, 1, null),

  -- Project 6
  (0, 0, 'HIGH', 'TASK', 'Define Project Scope', 'Define Project Scope', 100, NOW() + INTERVAL 1 DAY, NOW(), NOW(), 16, 25, 6, 1, null),
  (1, 1, 'HIGH', 'BUG', 'Develop Core Modules', 'Develop Core Modules', 100, NOW() + INTERVAL 2 DAY, NOW(), NOW(), 16, 25, 6, 1, null),
  (2, 2, 'MEDIUM', 'REVIEW', 'Optimize Performance', 'Optimize Performance', 100, NOW() + INTERVAL 3 DAY, NOW(), NOW(), 16, 25, 6, 1, null),
  (3, 3, 'HIGH', 'TASK', 'Write User Documentation', 'Write User Documentation', 100, NOW() + INTERVAL 4 DAY, NOW(), NOW(), 16, 25, 6, 1, null),
  (4, 4, 'MEDIUM', 'BUG', 'Deploy the Application', 'Deploy the Application', 100, NOW() + INTERVAL 5 DAY, NOW(), NOW(), 16, 25, 6, 1, null),
  (5, 5, 'MEDIUM', 'REVIEW', 'Test the Application', 'Test the Application', 100, NOW() + INTERVAL 6 DAY, NOW(), NOW(), 16, 25, 6, 1, null);



  `;

  // Insert data into Assignee table
  await prisma.$executeRaw`
    INSERT INTO Assignee (createdAt, userId, issueId)
    VALUES
    (NOW(),1,1),
    (NOW(),2,1),
    (NOW(),3,2),
    (NOW(),4,3),
    (NOW(),5,3),
    (NOW(),6,3),
    (NOW(),1,4),
    (NOW(),2,5),
    (NOW(),3,6),
    (NOW(),4,7),
    (NOW(),5,7),
    (NOW(),6,8),
    (NOW(),2,8),
    (NOW(),3,8),
    (NOW(),7,9),
    (NOW(),8,9),
    (NOW(),9,9),
    (NOW(),1,10),
    (NOW(),2,10),
    (NOW(),3,11),
    (NOW(),4,12),
    (NOW(),5,12),
    (NOW(),1,24),
    (NOW(),2,24),
    (NOW(),3,24),
    (NOW(),4,24),
    (NOW(),5,24),
    (NOW(),2,25),
    (NOW(),3,26),
    (NOW(),4,26),
    (NOW(),1,27),
    (NOW(),2,27),
    (NOW(),3,28),
    (NOW(),4,29),
    (NOW(),5,29),
    (NOW(),3,30),
    (NOW(),4,30);
 
  `;

  // Insert data into Comment table
  await prisma.$executeRaw`
    INSERT INTO Comment (descr, createdAt, issueId, userId)
    VALUES
    ('The session update is not working properly', NOW() + INTERVAL 1 MINUTE, 7, 4),
    ('This NextAuth version has issues with the session, try others workaround', NOW()+ INTERVAL 10 MINUTE, 7, 5),
    ('Should we use passportjs or just handle auth by ourselves?', NOW(), 8, 3),
    ('I think we should use passportjs, it is more secure', NOW() + INTERVAL 7 MINUTE, 8, 2),
    ('Đã update pull request, xin hãy review', NOW() + INTERVAL 1 MINUTE, 30, 4);
  `;

  // Insert data into Notification table
  await prisma.$executeRaw`
    INSERT INTO Notification (type, isRead, createdAt, updatedAt, userId, projectId, issueId)
    VALUES
      ('ASSIGNED_TO_ISSUE', false, NOW(), NOW(), 1, 1, 10),
      ('ASSIGNED_TO_ISSUE', false, NOW() - INTERVAL 1 DAY, NOW(), 1, 2, 27),
      ('PROJECT_INVITE', false, NOW()- INTERVAL 2 DAY, NOW(), 1, 6, null);
  `;
}

main()
  .then(() => console.log('Seed data created successfully!'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
