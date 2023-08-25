package com.ruoyi.system.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.system.mapper.StudentsMapper;
import com.ruoyi.system.domain.Students;
import com.ruoyi.system.service.IStudentsService;

/**
 * 学生Service业务层处理
 * 
 * @author ruoyi
 * @date 2023-08-25
 */
@Service
public class StudentsServiceImpl implements IStudentsService 
{
    @Autowired
    private StudentsMapper studentsMapper;

    /**
     * 查询学生
     * 
     * @param studentId 学生主键
     * @return 学生
     */
    @Override
    public Students selectStudentsByStudentId(Long studentId)
    {
        return studentsMapper.selectStudentsByStudentId(studentId);
    }

    /**
     * 查询学生列表
     * 
     * @param students 学生
     * @return 学生
     */
    @Override
    public List<Students> selectStudentsList(Students students)
    {
        return studentsMapper.selectStudentsList(students);
    }

    /**
     * 新增学生
     * 
     * @param students 学生
     * @return 结果
     */
    @Override
    public int insertStudents(Students students)
    {
        return studentsMapper.insertStudents(students);
    }

    /**
     * 修改学生
     * 
     * @param students 学生
     * @return 结果
     */
    @Override
    public int updateStudents(Students students)
    {
        return studentsMapper.updateStudents(students);
    }

    /**
     * 批量删除学生
     * 
     * @param studentIds 需要删除的学生主键
     * @return 结果
     */
    @Override
    public int deleteStudentsByStudentIds(Long[] studentIds)
    {
        return studentsMapper.deleteStudentsByStudentIds(studentIds);
    }

    /**
     * 删除学生信息
     * 
     * @param studentId 学生主键
     * @return 结果
     */
    @Override
    public int deleteStudentsByStudentId(Long studentId)
    {
        return studentsMapper.deleteStudentsByStudentId(studentId);
    }
}
